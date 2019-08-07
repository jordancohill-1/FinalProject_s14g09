// intialize swup
const swup = new Swup();

// find navbar toggler and menu
const navbarToggler = document.getElementsByClassName('navbar-toggler')
const navbarMenu = document.querySelector('.navbar-collapse')

// toggle mobile menu on page change
document.addEventListener('swup:clickLink', event => {
  if (screen.width < 576 && navbarMenu.classList.contains('show')) {
    navbarToggler[0].click()
  }
});

// scroll to top of page before replacing content
document.addEventListener('swup:willReplaceContent', event => {
  document.body.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  document.body.style.scrollBehavior = "smooth";
})

// load d3 scripts when trends page is loaded
// set cache to true in production
document.addEventListener('swup:contentReplaced', function () {
  if (window.location.pathname == '/trends') {
    $.getScript({url: 'https://d3js.org/d3.v5.min.js', cache: true}, function () {
      $.getScript({url: '/static/js/facesChart.js', cache: true});
      $.getScript({url: '/static/js/scatterChart.js', cache: true});
      $.getScript({url: '/static/js/chartsMaster.js', cache: true});
    });
  }
  if (window.location.pathname == '/') {
    init()
  }
  if (window.location.pathname == '/upload') {
    var input = document.getElementById( 'poster' );
    var infoArea = document.getElementById( 'posterLabel' );
  
    input.addEventListener( 'change', showFileName );
  
    function showFileName( event ) {
    
      var input = event.srcElement;
  
      var fileName = input.files[0].name;
  
      infoArea.textContent = fileName;
    }
  }
});