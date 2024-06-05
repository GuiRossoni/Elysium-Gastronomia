let isGrayscale = false;
let fontSize = 16;
let isNarratorOn = false;
let currentColorBlindnessFilter = '';

function applyColorBlindnessFilter(type) {
    const filters = {
        'protanopia': 'url(#protanopia)',
        'deuteranopia': 'url(#deuteranopia)',
        'tritanopia': 'url(#tritanopia)',
        'none': 'none'
    };

    if (currentColorBlindnessFilter === type) {
        document.body.style.filter = 'none';
        currentColorBlindnessFilter = '';
    } else {
        document.body.style.filter = filters[type];
        currentColorBlindnessFilter = type;
    }

    updateActiveButtons();
}

function invertColors() {
    const body = document.body;
    const currentFilter = body.style.filter;
    if (currentFilter.includes('invert')) {
        body.style.filter = currentFilter.replace('invert(100%)', 'none');
        document.documentElement.style.setProperty('--cor3', '');
        document.documentElement.style.setProperty('--footer-background', 'var(--cor3)');
    } else {
        body.style.filter = 'invert(100%)';
        document.documentElement.style.setProperty('--cor3', 'white');
        document.documentElement.style.setProperty('--footer-background', 'black');
    }
    updateActiveButtons();
}

function updateActiveButtons() {
    const buttons = document.querySelectorAll('.topbar button');
    buttons.forEach(button => {
        const buttonType = button.innerText.toLowerCase();

        if (buttonType === currentColorBlindnessFilter ||
            (buttonType === 'tons de cinza' && isGrayscale) ||
            (buttonType === 'narrador' && isNarratorOn)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function grayscale() {
    if (!isGrayscale) {
        document.body.style.filter = 'grayscale(100%)';
    } else {
        document.body.style.filter = 'grayscale(0%)';
    }
    isGrayscale = !isGrayscale;
    updateActiveButtons();
}

function increaseFontSize() {
    fontSize += 2;
    document.body.style.fontSize = fontSize + 'px';
    var elementosFonteAjustavel = document.getElementsByClassName("fonte-ajustavel");
    for (var i = 0; i < elementosFonteAjustavel.length; i++) {
        elementosFonteAjustavel[i].style.fontSize = fontSize + 'px';
    }
}

function decreaseFontSize() {
    if (fontSize > 10) {
        fontSize -= 2;
        document.body.style.fontSize = fontSize + 'px';
        var elementosFonteAjustavel = document.getElementsByClassName("fonte-ajustavel");
        for (var i = 0; i < elementosFonteAjustavel.length; i++) {
            elementosFonteAjustavel[i].style.fontSize = fontSize + 'px';
        }
    }
}

function toggleNarrator() {
    isNarratorOn = !isNarratorOn;
    if (isNarratorOn) {
        enableNarrator();
    } else {
        disableNarrator();
    }
    updateActiveButtons();
}

function enableNarrator() {
    document.addEventListener('mouseover', handleMouseOver);
}

function disableNarrator() {
    document.removeEventListener('mouseover', handleMouseOver);
    window.speechSynthesis.cancel();
}

function handleMouseOver(event) {
    if (isNarratorOn) {
        let text = event.target.getAttribute('aria-label') || event.target.alt;
        if (text) {
            speakText(text);
        }
    }
}

function speakText(text) {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

window.addEventListener('beforeunload', () => {
    disableNarrator();
});

window.onload = function() {
    window.addEventListener('scroll', toggleBackToTopButton);
};

function toggleBackToTopButton() {
    var backToTopButton = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

function showAccessKeys() {
    const elementsWithAccessKey = document.querySelectorAll('[accesskey]');
    document.getElementById('accessKeyHint').style.display = 'inline';
  
    elementsWithAccessKey.forEach(element => {
      const accessKeySpan = document.createElement('span');
      accessKeySpan.classList.add('accesskey-label');
      accessKeySpan.textContent = ` (Alt+${element.getAttribute('accesskey')})`;
      element.parentNode.insertBefore(accessKeySpan, element.nextSibling);
    });
  }
  
  function hideAccessKeys() {
    const accessKeySpans = document.querySelectorAll('.accesskey-label');
    document.getElementById('accessKeyHint').style.display = 'none';
    accessKeySpans.forEach(span => span.remove());
  }
  
  const showAccessKeyButton = document.getElementById('showAccessKeyButton');
  const hideAccessKeyButton = document.getElementById('hideAccessKeyButton');

  showAccessKeyButton.addEventListener('click', showAccessKeys);
  hideAccessKeyButton.addEventListener('click', hideAccessKeys);

