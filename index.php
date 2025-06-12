<?php

/**
 * @defgroup plugins_generic_pdfEmbedViewer PDF Embed Viewer Plugin
 */

/**
 * @file plugins/reports/pdfEmbedViewer/index.php
 *
 * Copyright (c) 2025 Lepidus Tecnologia
 * Distributed under the GNU GPL v3. For full terms see LICENSE or https://www.gnu.org/licenses/gpl-3.0.txt.
 *
 * @ingroup plugins_generic_pdfEmbedViewer
 * @brief Wrapper for PDF Embed Viewer plugin.
 *
 */

require_once('PdfEmbedViewerPlugin.inc.php');

return new PdfEmbedViewerPlugin();
