<?php

if (! function_exists('renderEditorMenus')) {
    /**
     * Render nodes for nested sets.
     *
     * @param $node
     * @param $resource
     * @return string
     */
    function renderEditorMenus($node, $editorLocale, $slug = null)
    {
        if (empty($slug)) {
            if (config('app.fallback_locale') !== $editorLocale) {
                $slug .= '/'.$editorLocale;
            }
        }
        $id = 'data-id="'.$node->id.'"';
        $list = 'class="dd-list"';
        $class = 'class="dd-item"';
        $handle = 'class="dd-handle"';
        $slug .= '/'.$node->slug;
        $target = '';
        if ($node->external_link != '') {
            $slug = $node->external_link;
            $target = ' target="_blank"';
        }
        //$name  = '<span class="ol-buttons"> ' . get_ops($resource, $node->id, 'inline') . '</span>';

        $active = ($node->active == 1) ? 'fa-circle' : 'fa-circle-o';
        $active_data = ($node->active == 1) ? 0 : 1;

        $actions = '<div class="btn-group pull-right" role="group" aria-label="...">'.
                    '<button type="button" class="btn btn-link btn-xs load" data-toggle="tooltip" title="load in Browser">'.
                        '<i class="fa fa-external-link" data-url="'.$slug.'" data-target="'.$target.'"></i>'.
                    '</button>'.
                    '<button type="button" class="btn btn-link btn-xs edit" title="settings">'.
                        '<i class="fa fa-gear"></i>'.
                    '</button>';

        if (config('app.fallback_locale') == $editorLocale) {
            $actions .=
                    '<button type="button" class="btn btn-link btn-xs toggleActive" title="status">'.
                        '<i class="fa '.$active.'" data-active="'.$active_data.'"></i>'.
                    '</button>'.
                    '<button type="button" class="btn btn-link btn-xs delete" title="delete">'.
                        '<i class="fa fa-times"></i>'.
                    '</button>';
        }
        $actions .= '</div>';

        $name = '<div '.$handle.'><i class="fa fa-arrows"></i></div>';
        $name .= '<div class="dd-content"><span class="dd-title">'.$node->name.'</span>'.$actions.'</div>';

        if ($node->isLeaf()) {
            return '<li '.$class.' '.$id.'>'.$name.'</li>';
        } else {
            $html = '<li '.$class.' '.$id.'>'.$name;
            $html .= '<ol '.$list.'>';
            foreach ($node->children as $child) {
                $html .= renderEditorMenus($child, $editorLocale, $slug);
            }
            $html .= '</ol>';
            $html .= '</li>';
        }

        return $html;
    }
}

if (! function_exists('renderEditorPages')) {
    /**
     * Render nodes for nested sets.
     *
     * @param $node
     * @param $resource
     * @return string
     */
    function renderEditorPages($page, $editorLocale)
    {
        $id = 'data-id="'.$page->id.'"';
        $list = 'class="dd-list"';
        $class = 'class="dd-item"';
        $delete = '<button type="button" class="btn btn-link btn-xs delete" data-toggle="tooltip" title="delete"><i class="fa fa-fw fa-times"></i></button>';
        if ($page->id == 1) {
            $delete = '<button type="button" class="btn btn-link btn-xs"><i class="fa fa-fw"></i></button>';
        }
        $url = '';
        if (config('app.fallback_locale') !== $editorLocale) {
            $url .= '/'.$editorLocale;
        }
        $url .= '/page/'.$page->slug;

        $actions = '<div class="btn-group pull-right" role="group" aria-label="...">'.
                    '<button type="button" class="btn btn-link btn-xs load" data-toggle="tooltip" title="load in Browser">'.
                        '<i class="fa fa-external-link" data-url="'.$url.'"></i>'.
                    '</button>'.
                    '<button type="button" class="btn btn-link btn-xs settings" data-toggle="tooltip" title="settings">'.
                        '<i class="fa fa-gear"></i>'.
                    '</button>';
        if (config('app.fallback_locale') == $editorLocale) {
            $actions .= '<button type="button" class="btn btn-link btn-xs duplicate" data-toggle="tooltip" title="duplicate">'.
                                    '<i class="fa fa-copy"></i>'.
                                '</button>'.
                                $delete;
        }
        $actions .= '</div>';

        $name = '<div class="dd-content"><span class="dd-title">'.$page->title.'</span>'.$actions.'</div>';

        return '<li '.$class.' '.$id.'>'.$name.'</li>';
    }
}

if (! function_exists('templateRegion')) {
    /**
     * Render nodes for nested sets.
     *
     * @param $node
     * @param $resource
     * @return string
     */
    function templateRegion($resource, $region)
    {
        $html = '';
        if (Auth::check()) {
            $findRegion = $resource->regions->contains('name', $region);
            if ($findRegion) {
                foreach ($resource->regions as $reg) {
                    if ($reg->name == $region) {
                        $html .= '<div class="jodelRegion" data-region-id="'.$reg->id.'">';
                        foreach ($reg->elements as $element) {
                            $html .= \App\Http\Controllers\ElementsController::renderElementView($element, $element->content);
                        }
                        $html .= '</div>';
                    }
                }

                return $html;
            }

            $newRegion = new App\Region;
            $newRegion->name = $region;
            $resource->regions()->save($newRegion);
            $html .= '<div class="jodelRegion" data-region-id="'.$newRegion->id.'"></div>';

            return $html;
        }

        foreach ($resource->regions as $reg) {
            if ($reg->name == $region) {
                $html .= '<div>';
                foreach ($reg->elements as $element) {
                    $html .= \App\Http\Controllers\ElementsController::renderElementView($element, $element->content);
                }
                $html .= '</div>';
            }
        }

        return $html;
    }
}
