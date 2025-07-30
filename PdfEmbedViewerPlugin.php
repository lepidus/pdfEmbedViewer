<?php

/**
 * @file plugins/reports/pdfEmbedViewer/PdfEmbedViewerPlugin.php
 *
 * Copyright (c) 2025 Lepidus Tecnologia
 * Copyright (c) 2025 SciELO
 * Distributed under the GNU GPL v3. For full terms see LICENSE or https://www.gnu.org/licenses/gpl-3.0.txt.
 *
 * @class PdfEmbedViewerPlugin
 * @ingroup plugins_generic_pdfEmbedViewer
 *
 * @brief 'PDF Embed Viewer' plugin
 */

namespace APP\plugins\generic\pdfEmbedViewer;

use PKP\plugins\GenericPlugin;
use APP\core\Application;
use PKP\plugins\Hook;
use PKP\plugins\PluginRegistry;

class PdfEmbedViewerPlugin extends GenericPlugin
{
    public function register($category, $path, $mainContextId = null)
    {
        $success = parent::register($category, $path, $mainContextId);

        if (Application::isUnderMaintenance()) {
            return $success;
        }

        if ($success && $this->getEnabled($mainContextId)) {
            Hook::add('Template::Workflow::Publication', [$this, 'addPdfEmbedViewer']);
        }

        return $success;
    }

    public function getDisplayName()
    {
        return __('plugins.generic.pdfEmbedViewer.displayName');
    }

    public function getDescription()
    {
        return __('plugins.generic.pdfEmbedViewer.description');
    }

    public function addPdfEmbedViewer($hookName, $params)
    {
        $templateMgr = &$params[1];
        $output = &$params[2];

        $pdfJsViewerPlugin = PluginRegistry::getPlugin('generic', 'pdfjsviewerplugin');
        $request = Application::get()->getRequest();

        $templateMgr->assign('pdfJsViewerPluginUrl', $request->getBaseUrl() . '/' . $pdfJsViewerPlugin->getPluginPath());

        $output .= sprintf('%s', $templateMgr->fetch($this->getTemplateResource('pdfEmbedViewer.tpl')));
    }
}
