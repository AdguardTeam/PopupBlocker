var ifr = document.createElement('iframe');

ifr.src = "https://tpc.googlesyndication.com/safeframe/1-0-2/html/container.html";
ifr.setAttribute('sandbox', '');
ifr.contentWindow;

ifr.setAttribute('sandbox', 'allow-script');