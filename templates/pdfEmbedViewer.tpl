<div id="pdfEmbedViewerTemplate" style="display: none;">
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
    function setAndDisplayEmbedViewer() {
        let pdfEmbedViewer = document.getElementById('pdfEmbedViewer');
        if (pdfEmbedViewer) {
            pdfEmbedViewer.remove();
        }

        let pdfEmbedViewerUrl = "{$pdfJsViewerPluginUrl}/pdf.js/web/viewer.html?file=";
        let trs = document.getElementById('galleys').querySelector('tbody').querySelectorAll('tr');
        if (trs.length >= 2) {
            let downloadLink = trs[0].querySelector('a.pkp_linkaction_downloadFile');
            if (downloadLink) {
                let embedPdfUrl = downloadLink.getAttribute('href');
                let pdfEmbedViewer = document.getElementById('pdfEmbedViewerTemplate').cloneNode(true);
                pdfEmbedViewer.id = 'pdfEmbedViewer';
                document.body.appendChild(pdfEmbedViewer);

                $("#pdfEmbedViewer > iframe").attr("src", pdfEmbedViewerUrl + encodeURIComponent(embedPdfUrl));
                $(trs[1]).after($("#pdfEmbedViewer"));
                $("#pdfEmbedViewer").css("display", "block");
            }
        }
    }

    function listenToGalleyGridRequests() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.search('preprint-galley-grid') >= 0 && (url.search('fetch-grid') >= 0 || url.search('fetch-row') >= 0)) {
                this.addEventListener('load', function() {
                    setTimeout(function() {
                        setAndDisplayEmbedViewer();
                    }, 2000);
                });
            }
            originalOpen.apply(this, arguments);
        };
    }
    
    $(document).ready(function() {
        listenToGalleyGridRequests();
    });
</script>