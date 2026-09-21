import { h, render } from 'preact';
import { Alert } from '../../../../../src/pages/notifications/components/Alert/Alert';
import { applyStoredTheme, Theme } from '../../../../../src/theme';

const { expect } = chai;

/**
 * Rasterizes the shield artwork to check its gradient and fallback pixels.
 * This does not replace visual checks of SVG references in the notification iframe.
 *
 * @param icon The shield in the notification, including its local gradient definition.
 * @returns Pixel data for the rendered shield.
 */
const paintShield = async (icon: SVGSVGElement): Promise<ImageData> => {
    const clone = icon.cloneNode(true) as SVGSVGElement;
    const style = icon.ownerDocument.defaultView.getComputedStyle(icon);
    // Preserve inherited custom properties when the SVG leaves the notification document.
    Array.from(style).forEach((property) => {
        if (property.startsWith('--')) {
            clone.style.setProperty(property, style.getPropertyValue(property));
        }
    });
    // Load the test image in the runner document, outside the iframe's restrictive image CSP.
    const image = document.createElement('img');
    await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Could not rasterize shield'));
        image.src = `data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
    });
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
};

describe('Notification icons', () => {
    let frame: HTMLIFrameElement;
    let doc: Document;
    let win: Window;

    const renderAlert = () => {
        render(h(Alert, { numPopup: 1, origDomain: 'example.org', destUrl: 'https://example.com/' }), doc.body);
        doc.querySelector('.alert').classList.add('alert--show');
    };

    beforeEach(async () => {
        frame = document.createElement('iframe');
        frame.style.cssText = 'position: absolute; left: -10000px; width: 500px; height: 300px;';
        await new Promise<void>((resolve) => {
            frame.onload = () => resolve();
            document.body.appendChild(frame);
        });
        doc = frame.contentDocument;
        win = frame.contentWindow;
    });

    afterEach(() => {
        render(null, doc.body);
        frame.remove();
    });

    // Allow styles in the default-src case to isolate image restrictions. General style/font CSP
    // support is separate; the style-blocked test below checks only the icons' intrinsic sizes.
    ["img-src 'self'", "img-src 'none'", "default-src 'self'; style-src 'unsafe-inline'"].forEach((policy) => {
        it(`renders all four icons without image violations under ${policy}`, async () => {
            const meta = doc.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = policy;
            doc.head.appendChild(meta);
            const violations: string[] = [];
            const probeOrigin = 'https://csp-probe.invalid';
            const probeViolation = new Promise<SecurityPolicyViolationEvent>((resolve) => {
                doc.addEventListener('securitypolicyviolation', (event) => {
                    if (event.blockedURI.startsWith(probeOrigin)) {
                        resolve(event);
                    } else {
                        violations.push(event.effectiveDirective);
                    }
                });
            });

            renderAlert();
            const icons = doc.querySelectorAll('svg');
            expect(icons.length).to.equal(4);
            icons.forEach((icon) => {
                expect(icon.namespaceURI).to.equal('http://www.w3.org/2000/svg');
                expect(icon.getBoundingClientRect().width).to.be.greaterThan(0);
                expect(icon.getAttribute('aria-hidden')).to.equal('true');
                expect(icon.getAttribute('focusable')).to.equal('false');
            });

            // Check resource dependencies directly, so success does not depend on how quickly
            // the browser delivers violations. Include pseudo-elements used by the old CSS icons.
            doc.querySelectorAll('.alert__close, .alert__ico, .alert__select, .pin').forEach((element) => {
                [null, '::before', '::after'].forEach((pseudo) => {
                    const style = win.getComputedStyle(element, pseudo);
                    ['background-image', 'mask-image', '-webkit-mask-image'].forEach((property) => {
                        expect(style.getPropertyValue(property)).not.to.contain('url(');
                    });
                });
            });
            expect(doc.querySelectorAll('img, image, use').length).to.equal(0);

            // Wait for a real CSP event and its image error instead of an arbitrary delay.
            // The probe is blocked before any network request by all three policies.
            const image = doc.createElement('img');
            const probeLoaded = new Promise<boolean>((resolve) => {
                image.onload = () => resolve(true);
                image.onerror = () => resolve(false);
                image.src = `${probeOrigin}/blocked.svg`;
                doc.body.appendChild(image);
            });
            const [violation, loaded] = await Promise.all([probeViolation, probeLoaded]);
            expect(violation.effectiveDirective, 'CSP probe effective directive').to.equal('img-src');
            expect(loaded).to.equal(false);
            expect(violations).to.deep.equal([]);
        });
    });

    it('keeps explicit icon dimensions when the notification stylesheet is blocked', () => {
        const meta = doc.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self'";
        doc.head.appendChild(meta);
        renderAlert();

        const sizes = [[15, 15], [48, 48], [10, 8], [16, 16]];
        doc.querySelectorAll('svg').forEach((icon, index) => {
            const [width, height] = sizes[index];
            expect(icon.getAttribute('width')).to.equal(String(width));
            expect(icon.getAttribute('height')).to.equal(String(height));
            const rect = icon.getBoundingClientRect();
            expect(rect.width).to.equal(width);
            expect(rect.height).to.equal(height);
        });
    });

    it('keeps monochrome icons themed and preserves icon sizes', () => {
        renderAlert();
        const close = doc.querySelector('.alert__close svg');
        const arrow = doc.querySelector('.alert__select svg');
        const shield = doc.querySelector('.alert__ico svg');
        const pin = doc.querySelector('.pin svg');
        [[close, 15, 15], [arrow, 10, 8], [shield, 48, 48], [pin, 16, 16]].forEach(([icon, width, height]) => {
            const rect = (icon as Element).getBoundingClientRect();
            expect(rect.width).to.equal(width);
            expect(rect.height).to.equal(height);
        });
        const buttonRect = pin.parentElement.getBoundingClientRect();
        const iconRect = pin.getBoundingClientRect();
        expect(iconRect.left + iconRect.width / 2).to.be.closeTo(buttonRect.left + buttonRect.width / 2, 0.5);
        expect(iconRect.top + iconRect.height / 2).to.be.closeTo(buttonRect.top + buttonRect.height / 2, 0.5);

        const colors: string[] = [];
        [Theme.Light, Theme.Dark].forEach((theme) => {
            applyStoredTheme(doc, theme);
            const sample = doc.createElement('span');
            doc.body.appendChild(sample);
            sample.style.color = 'var(--icon-color)';
            const closeColor = win.getComputedStyle(close.querySelector('path')).stroke;
            expect(closeColor).to.equal(win.getComputedStyle(sample).color);
            colors.push(closeColor);
            sample.style.color = 'var(--icon-arrow-color)';
            const arrowColor = win.getComputedStyle(arrow.querySelector('path')).stroke;
            expect(arrowColor).to.equal(win.getComputedStyle(sample).color);
            sample.remove();
        });
        expect(colors[0]).not.to.equal(colors[1]);
    });

    it('assigns independent local gradients to the alert and pin', () => {
        renderAlert();
        const gradients = doc.querySelectorAll('linearGradient');
        expect(gradients.length).to.equal(2);
        expect(gradients[0].id).not.to.equal(gradients[1].id);
        doc.querySelectorAll('.alert__ico svg, .pin svg').forEach((icon) => {
            const gradient = icon.querySelector('linearGradient');
            expect(icon.querySelector('path').getAttribute('fill'))
                .to.equal(`url(#${gradient.id}) var(--icon-shield-start)`);
        });

        doc.querySelector('.alert').classList.remove('alert--show');
        expect(doc.querySelector('.pin svg').getBoundingClientRect().width).to.equal(16);
    });

    [Theme.Light, Theme.Dark].forEach((theme) => {
        it(`paints the pinned shield gradient and a solid fallback in ${theme} mode`, async () => {
            renderAlert();
            applyStoredTheme(doc, theme);
            doc.querySelector('.alert').classList.remove('alert--show');
            const icon = doc.querySelector<SVGSVGElement>('.pin svg');
            const gradient = icon.querySelector('linearGradient');
            const painted = await paintShield(icon);
            // Both samples are inside the shield, clear of the white window strokes.
            const top = (3 * painted.width + 8) * 4;
            const bottom = (12 * painted.width + 8) * 4;
            expect(painted.data[top + 3]).to.equal(255);
            expect(painted.data[bottom + 3]).to.equal(255);
            expect(painted.data[top + 1]).to.be.greaterThan(painted.data[top]);
            expect(painted.data[top + 1]).to.be.greaterThan(painted.data[bottom + 1]);

            gradient.remove();
            // A broken gradient reference must still paint the fallback, using the semantic token.
            icon.style.setProperty('--icon-shield-start', 'rgb(20, 180, 40)');
            const fallback = await paintShield(icon);
            expect(Array.from(fallback.data.slice(top, top + 4))).to.deep.equal([20, 180, 40, 255]);
            expect(Array.from(fallback.data.slice(bottom, bottom + 4))).to.deep.equal([20, 180, 40, 255]);
        });
    });
});
