<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="utf-8"> <!-- utf-8 works for most cases -->
	<meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="”x-apple-disable-message-reformatting”">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
	<title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
    <!-- http://tedgoas.github.io/Cerberus/ -->
	<!-- Web Font / @font-face : BEGIN -->
	<!-- NOTE: If web fonts are not required, lines 9 - 26 can be safely removed. -->
	
	<!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
	<!--[if mso]>
		<style>
			* {
				font-family: sans-serif !important;
			}
		</style>
	<![endif]-->
	
	<!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
	<!--[if !mso]><!-->
		<!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->
	<!--<![endif]-->

	<!-- Web Font / @font-face : END -->
	
	<!-- CSS Reset -->
    
    
    <!-- Progressive Enhancements -->
    

<style type="text/css">
		html,body{
			margin:0 auto !important;
			padding:0 !important;
			height:100% !important;
			width:100% !important;
		}
		*{
			-ms-text-size-adjust:100%;
			-webkit-text-size-adjust:100%;
		}
		div[style*=margin: 16px 0]{
			margin:0 !important;
		}
		table,td{
			mso-table-lspace:0pt !important;
			mso-table-rspace:0pt !important;
		}
		table{
			border-spacing:0 !important;
			border-collapse:collapse !important;
			table-layout:fixed !important;
			margin:0 auto !important;
		}
		table table table{
			table-layout:auto;
		}
		img{
			-ms-interpolation-mode:bicubic;
		}
		.mobile-link--footer a,a[x-apple-data-detectors]{
			color:inherit !important;
			text-decoration:underline !important;
		}
		.button-td,.button-a{
			transition:all 100ms ease-in;
		}
		.button-td:hover,.button-a:hover{
			background:#555555 !important;
			border-color:#BBBCC2 !important;
		}
		.small-hidden{
			display:block;
		}
		.large-hidden{
			display:none;
		}
	@media screen and (max-width: 600px){
		.email-container{
			width:100% !important;
			margin:auto !important;
		}

}	@media screen and (max-width: 600px){
		.fluid{
			max-width:100% !important;
			height:auto !important;
			margin-left:auto !important;
			margin-right:auto !important;
		}

}	@media screen and (max-width: 600px){
		.stack-column,.stack-column-center{
			display:block !important;
			width:100% !important;
			max-width:100% !important;
			direction:ltr !important;
		}

}	@media screen and (max-width: 600px){
		.stack-column-center{
			text-align:left !important;
		}

}	@media screen and (max-width: 600px){
		.stack-column-center td.on-small{
			padding:0 10px 0 0 !important;
		}

}	@media screen and (max-width: 600px){
		.center-on-narrow{
			text-align:left !important;
			display:block !important;
			margin-left:auto !important;
			margin-right:auto !important;
			float:none !important;
		}

}	@media screen and (max-width: 600px){
		table.center-on-narrow{
			display:inline-block !important;
		}

}	@media screen and (max-width: 600px){
		.small-hidden{
			display:none;
		}

}	@media screen and (max-width: 600px){
		.large-hidden{
			display:block;
		}

}		a{
			text-decoration:none;
		}
</style></head>
<body bgcolor="#DCE0E5" width="100%>
    <center style="width: 100%; background: #DCE0E5;">

    @yield('content')
        
    </center>
</body>
</html>

