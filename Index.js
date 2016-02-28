var gifs = [];

var lastItemId;
$(document).ready(function () {


    //addMoreListings();
    //initializePacker();
    $.getJSON("https://www.reddit.com/.json?limit=100", function (data) {
        var items = [];
        $.each(data.data.children, function (i, obj) {
            var preview = obj.data.preview;
            if ((preview != null) && (preview.images != null)) {

                var source = preview.images[0].source;
                var imageSourceUrl = source.url;
                var height = source.height;
                var width = source.width;

                var bestImageSize = bestSize(height, width);

                var listingEntry = document.createElement("div");
                listingEntry.className = "item" + bestImageSize.ID;

                var image = document.createElement("div");
                image.className = "item-content" + bestImageSize.ID;

                image.style.backgroundImage = "url(" + imageSourceUrl + ")";

                //shrink title sizes if they are too long
                var smartTitle = obj.data.title;
                if (bestImageSize.ID == 1) {
                    if ((smartTitle.length > 125)) {
                        image.style.fontSize = "62.5%";       
                    }
                }

                image.innerHTML = "<span> " + smartTitle + "</span> <br />" + "<br />" + "/r/" + obj.data.subreddit;

                //gif check
                if (obj.data.subreddit == "gifs") {

                    //remove gifv
                    var stripped = obj.data.url;
                    if (stripped[stripped.length - 1] == 'v') { stripped = stripped.substring(0, stripped.length - 1); }
                    var gif = {title:obj.data.title, url:stripped, imgUrl:source.url};
                    gifs.push(gif);
                    image.className += " gif";
                }

                listingEntry.appendChild(image);

                var grid = document.getElementById("packery");
                grid.appendChild(listingEntry);

                lastItemId = obj.data.id;
            }
        });
        initializePacker();
    });
    
  
});

function bestSize(height, width) {
    var classes = [{ Width: 250, Height: 250, ID: 1 }, { Width: 500, Height: 250, ID: 2 }, { Width: 300, Height: 300, ID: 3 }];
    var minDist = 1;
    var ratio = height / width;
    var index = 0;
    for (var i = 0; i < 3; i++) {
        var dist = Math.abs((classes[i].Height / classes[i].Width) - ratio);
        if (dist < minDist) {
            minDist = dist;
            index = i;
        }
    }
    return classes[index];
}

var $container;
function initializePacker() {

    // get vendor transition property, i.e. WebkitTransition
    var transitionProp = getStyleProperty('transition');
    // get transition end event name
    var transitionEndEvent = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'otransitionend',
        transition: 'transitionend'
    }[transitionProp];

    $container = $('.packery').packery({
        gutter: 0,
        "columnWidth": 50,
        "rowHeight": 50
    });


    $("#header #headerlist li a").hover(function () {
        $(this).toggleClass('hover-highlight');
    });


    $container.on('mouseenter', ".gif", function (event) {
        var target = event.target;
        var $target = $(target);

        var title = $target[0].outerText.split("\n")[0];
        var x = gifs.filter(function (a) { return a.title == title })[0];

        $target.css("background", "url(" + x.url + ")");
        $target.css("background-size", "cover");

        alert("!");
    });

    $container.on('mouseleave', ".gif", function (event) {
        var target = event.target;
        var $target = $(target);

        var title = $target[0].outerText.split("\n")[0];
        var x = gifs.filter(function (a) { return a.title == title })[0];

        $target.css("background", "url(" + x.imgUrl + ")");
        $target.css("background-size", "100% 100%");

        alert("!!");

    });

    $container.on('click', ".item-content1, .item-content2, .item-content3", function (event) {
        var target = event.target;
        var $target = $(target);

        // disable transition
        $target.css(transitionProp, 'none');
        // set current size
        $target.css({
            width: $target.width(),
            height: $target.height()
        });

        var $itemElem = $target.parent();
        var isExpanded = $itemElem.hasClass('is-expanded');
        $itemElem.toggleClass('is-expanded');
        // force redraw
        var redraw = target.offsetWidth;
        // renable default transition
        target.style[transitionProp] = '';

        // reset 100%/100% sizing after transition end
        if (transitionProp) {
            $target.one(transitionEndEvent, function () {
                target.style.width = '';
                target.style.height = '';
            });
        }

        // set new size
        $target.css({
            width: $itemElem.width(),
            height: $itemElem.height()

        });

        if (isExpanded) {
            // if shrinking, just layout

            if (!$itemElem.hasClass('is-viewed')) {
                $itemElem.toggleClass('is-viewed');
            }
            $container.packery();

        } else {
            // if expanding, fit it
            $container.packery('fit', $itemElem[0]);
        }

        //$(target).css["background-color"] = white;

    });

    $(".item-content1, .item-content2, .item-content3").hover(function () {
        //if ($(this).hasClass("gif")) {
        //    //$(this).css("background-image", "url(" + something + ")");
        //    return;
        //}

        $(this).css("color", "black");
        $(this).css("background-color", "white");
    }, function () {

        $(this).css("background-color", "transparent");
        $(this).css("color", "transparent");
    });


    //title highlight goes h
    //$(".item-content1 > span, .item-content2 > span, .item-content3 > span").hover(function () {
    //    //346799
    //    $(this).css("color", "#346799");
    //}, function () {
       
    //});

    window.onscroll = function (ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            

            //addMoreListings(lastItemId);

        }
    };
}

//var urlString = "https://www.reddit.com/.json?limit=100&after=";
//function addMoreListings(lastId) {
    
//    if(lastId != null){
//        urlString = urlString + lastId;
//    }

//    $.getJSON(urlString, function (data) {
//        var items = [];
//        $.each(data.data.children, function (i, obj) {
//            var preview = obj.data.preview;
//            //console.log(obj.data.id);
//            if ((preview != null) && (preview.images != null)) {

//                var source = preview.images[0].source;
//                var imageSourceUrl = source.url;
//                //var height = source.height;
//                //var width = source.width;
//                //console.log(preview.images[0].source);

//                //var options = ["200,300"];
//                //var rand = options[Math.floor(Math.random() * options.length)];
//                //height = rand.split(',')[0];
//                //width = rand.split(',')[1];

//                var listingEntry = document.createElement("div");
//                listingEntry.className = "item";

//                var image = document.createElement("div");
//                image.className = "item-content";
//                image.style.backgroundImage = "url(" + imageSourceUrl + ")";
//                listingEntry.appendChild(image);

//                var grid = document.getElementById("packery");
//                grid.appendChild(listingEntry);

//                lastItemId = obj.data.id;

//            }
//        });
//    });
//}

//function transitionToTitle(image) {

//}