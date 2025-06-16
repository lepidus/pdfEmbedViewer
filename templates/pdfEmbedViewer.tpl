<div id="pdfEmbedViewer" style="display: none;">
    <iframe
        src=""
        width="100%"
        height="100%"
        style="min-height: 500px;"
        allow="fullscreen"
        webkitallowfullscreen="webkitallowfullscreen"
    ></iframe>
</div>

<script>
    $(document).ready(function() {
        setTimeout(function() {
            let pdfEmbedViewerUrl = "{$pdfJsViewerPluginUrl}/pdf.js/web/viewer.html?file=";
            let embedPdfUrl = '';
            let galleysTabTbodies = document.getElementById('galleys').querySelectorAll('tbody');

            if (galleysTabTbodies[1].style.display === 'none') {
                let trs = galleysTabTbodies[0].querySelectorAll('tr');
                let downloadLink = trs[0].querySelector('a.pkp_linkaction_downloadFile');
                
                embedPdfUrl = downloadLink.getAttribute('href');
                $("#pdfEmbedViewer > iframe").attr("src", pdfEmbedViewerUrl + encodeURIComponent(embedPdfUrl));
                $(trs[1]).after($("#pdfEmbedViewer"));
                $("#pdfEmbedViewer").css("display", "block");
            }
        }, 3000);
    });
</script>