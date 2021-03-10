<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="/themes/lovata-bootstrap-shopaholic/assets/css/common.css?id=45453b6cd7db9377eba1" />
        <link rel="stylesheet" href="/themes/lovata-bootstrap-shopaholic/assets/css/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Germania+One&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Carrois+Gothic+SC" rel="stylesheet" />
        <link rel="stylesheet" href="https://use.typekit.net/zaa2wmy.css" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet" />
    </head>
    <body class="body" data-cart-is-available="1">
        <header class="header2 container-fluid fixed-top" style="background-color: #f2f2f2; height: 90px;">
            <nav class="container navbar navbar-expand-lg navbar-dark">
                <a class="navbar-brand mr-5" href="http://sunsetpier.de" aria-label="Go to main page">
                    <img
                        alt=""
                        class="logoheader"
                        src="http://sunsetpier.de/storage/temp/public/38d/ac0/964/logoheaderblack__103.png"
                        srcset="http://sunsetpier.de/storage/temp/public/38d/ac0/964/logoheaderblack__103.png 103w"
                        sizes="(max-width: 103px) 100vw, 103px"
                    />
                    <p class="headertitle">SunsetPier</p>
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="row collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav col-12 col-lg-auto mr-auto mb-3 mb-lg-0"></ul>
                    <ul class="col-12 col-lg-auto order-1 order-lg-0 social-icon__list">
                        <li class="social-icon__item">
                            <a href="https://www.facebook.com/Sunset-Pier-114300960298939" class="social-icon__link" role="button" aria-label="Go to facebook plugin page"><i class="fa fa-lg fa-facebook fa-fw"></i></a>
                        </li>
                        <li class="social-icon__item">
                            <a href="https://www.instagram.com/sunsetpierclo/" class="social-icon__link" role="button" aria-label="Go to instagram plugin page"><i class="fa fa-lg fa-instagram fa-fw"></i></a>
                        </li>
                        <li class="social-icon__item">
                            <a href="https://twitter.com/sunsetpierclo" class="social-icon__link" role="button" aria-label="Go to twitter plugin page"><i class="fa fa-lg fa-twitter fa-fw"></i></a>
                        </li>
                    </ul>
                    <!--     <div class="_ajax_cart_link_header_wrapper col-12 col-lg-auto mb-4 mb-lg-0"><a href="http://sunsetpier.de/checkout" class="header__cart"><i class="fa fa-shopping-cart"></i>Cart <span class="header__cart-badge">0</span></a></div> -->
                </div>
            </nav>
        </header>
        <div class="site-content sitecontentbckg">
            <div class="bannertop">
                <img
                    alt=""
                    src="http://sunsetpier.de/storage/temp/public/e56/5c5/991/beanies-sharp-header__3024.jpg"
                    class="banner-image"
                    srcset="
                        http://sunsetpier.de/storage/temp/public/e56/5c5/991/beanies-sharp-header__3024.jpg 3024w,
                        http://sunsetpier.de/storage/temp/public/e56/5c5/991/beanies-sharp-header__400.jpg   400w,
                        http://sunsetpier.de/storage/temp/public/e56/5c5/991/beanies-sharp-header__768.jpg   768w,
                        http://sunsetpier.de/storage/temp/public/e56/5c5/991/beanies-sharp-header__1024.jpg 1024w
                    "
                    sizes="(max-width: 3024px) 100vw, 3024px"
                />
            </div>
            <div class="container">
                <div style="text-align: center;">
                    <?php
                        $price = 20;
                        $param = "test";
                    ?>
                    <h1 class="headheader">Classic Logo Beanie</h1>
                    <p class="headtext">
                        High quality Beanie in Jet Black. The Design is stiched into the Front Panel in Arctic White.<br />
                        30 + 3€ Shipping, Fees etc.
                        <a href="http://www.whatever.com/<?php echo $param; ?>">Click Here</a>
                    </p>
                    <form class="paypal-button" method="post" action="https://www.paypal.com/cgi-bin/webscr" target="_top">
                        <div id="errorBox" class="hide"></div>
                        <input name="button" value="buynow" type="hidden" />
                        <input name="item_name" value="" type="hidden" />
                        <input readonly="readonly" name="amount" value="<?php echo $price; ?>" type="hidden" />
                        <input name="env" value="www" type="hidden" />
                        <input name="return" value="http://sunsetpier.de//bagsthankyou" type="hidden" />
                        <input name="rm" value="2" type="hidden" />
                        <input name="currency_code" value="EUR" type="hidden" />
                        <input name="cmd" value="_xclick" type="hidden" />
                        <input name="business" value="l.prestle@welcome-ag.de" type="hidden" />
                        <input name="bn" value="JavaScriptButton_buynow" type="hidden" />
                        <button class="paypal-button large" type="submit">Buy Now</button>
                    </form>
                    <img
                        alt=""
                        class="Detailitem"
                        src="http://sunsetpier.de/storage/temp/public/255/686/769/beanie__2000.png"
                        srcset="
                            http://sunsetpier.de/storage/temp/public/255/686/769/beanie__2000.png 2000w,
                            http://sunsetpier.de/storage/temp/public/255/686/769/beanie__400.png   400w,
                            http://sunsetpier.de/storage/temp/public/255/686/769/beanie__768.png   768w,
                            http://sunsetpier.de/storage/temp/public/255/686/769/beanie__1024.png 1024w
                        "
                        sizes="(max-width: 2000px) 100vw, 2000px"
                    />
                    <a href="bundle-deals" class="sunsetlink" style="color: #202020;">
                        <p class="bundleteaser">Also Available in a Bundle Deal!</p>
                    </a>
                    <a href="new-arrivals" style="text-decoration: none; color: #202020;">
                        <p class="headtext">
                            Back to Overview >>
                        </p>
                    </a>
                </div>
            </div>
        </div>
        <footer class="footer">
            <!--  <div class="container-fluid footer__center"><div class="container"></div></div> -->
            <div class="container-fluid footer__bottom">
                <div class="container footer__bottom-text">
                    <div class="row" style="text-align: center;">
                        <div class="col-lg-6">
                            <p><a href="impressum" style="text-decoration: none; color: #f2f2f2;">Impressum</a></p>
                        </div>
                        <div class="col-lg-6">
                            <p><a href="datenschutz" style="text-decoration: none; color: #f2f2f2;">Datenschutz</a></p>
                        </div>
                    </div>
                    &copy; by Sunset Pier
                </div>
            </div>
        </footer>
        <script src="/themes/lovata-bootstrap-shopaholic/assets/js/common.js?id=4ea8c322a8c14ecc1528"></script>
        <script src="/modules/system/assets/js/framework.js"></script>
        <script src="/modules/system/assets/js/framework.extras.js"></script>
        <link rel="stylesheet" property="stylesheet" href="/modules/system/assets/css/framework.extras.css" />
        <script src="https://www.paypal.com/sdk/js?client-id=SB_CLIENT_ID">
            // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
    </body>
</html>
