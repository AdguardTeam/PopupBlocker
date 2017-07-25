var simulateClick = function(el){
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    (el || document.body).dispatchEvent(evt);
}

describe('popups1', function() {
    it('should prevent window.open when the event handler is triggered on document body.', function() {
        var popupOpener = function(evt) {
            var popup = window.open('about:blank', '_blank');
            expect(popup.toString()).to.not.equal('[object Window]');
        };
        document.body.addEventListener('click', popupOpener);
        simulateClick();
    });
});
