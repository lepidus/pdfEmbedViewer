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
    function setAndDisplayEmbedViewer(pdfEmbedViewerUrl, galleyTabTbody) {
        let trs = galleyTabTbody.querySelectorAll('tr');
        let downloadLink = trs[0].querySelector('a.pkp_linkaction_downloadFile');
        let embedPdfUrl = downloadLink.getAttribute('href');
        
        $("#pdfEmbedViewer > iframe").attr("src", pdfEmbedViewerUrl + encodeURIComponent(embedPdfUrl));
        $(trs[1]).after($("#pdfEmbedViewer"));
        $("#pdfEmbedViewer").css("display", "block");
    }
    
    $(document).ready(function() {
        setTimeout(function() {
            let pdfEmbedViewerUrl = "{$pdfJsViewerPluginUrl}/pdf.js/web/viewer.html?file=";
            let galleysTabTbodies = document.getElementById('galleys').querySelectorAll('tbody');

            if (galleysTabTbodies[1].style.display === 'none') {
                setAndDisplayEmbedViewer(pdfEmbedViewerUrl, galleysTabTbodies[0]);
            }
            
            const secondTbodyObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'style') {
                        if (galleysTabTbodies[1].style.display !== 'none') {
                            $("#pdfEmbedViewer").css("display", "none");
                        }
                    }
                });
            });
            
            secondTbodyObserver.observe(galleysTabTbodies[1], { attributes: true, attributeFilter: ['style'] });
        }, 3000);
    });
</script>