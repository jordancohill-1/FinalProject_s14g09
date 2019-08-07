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
    $.getScript({url: 'https://d3js.org/d3.v5.min.js', cache: false}, function () {
      $.getScript({url: '/static/js/barChart.js', cache: false});
      $.getScript({url: '/static/js/moviePlot.js', cache: false});
      $.getScript({url: '/static/js/facesChart.js', cache: false});
      $.getScript({url: '/static/js/scatterChart.js', cache: false});
    });
  }
  if (window.location.pathname == '/') {
    init()
  }
});