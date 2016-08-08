<?php

if (!function_exists('renderMainMenu')) {
    /**
     * Render nodes for nested sets
     *
     * @param $node
     * @return string
     */
    function renderMainMenu($node, $path, $link = null)
    {
        $list = 'class="dropdown-menu"';
        $class = 'class="dropdown"';
        $caret = '<i class="fa fa-caret-down"></i>';
        //$link = '';
        //$link = route('page', ['page_slug' => $node->slug]);
        if ($node->slug == "home") {
            $link .= LaravelLocalization::getLocalizedURL($locale = null, $url = '/');
        } else {
            $locale = LaravelLocalization::getCurrentLocale();
            if($locale != config('app.fallback_locale')) {
                $link .= '/' . LaravelLocalization::getCurrentLocale() . '/' . $node->slug;
            } else {
                $link .= '/' . $node->slug;
            }
            
            $single  = '<a href="'. LaravelLocalization::getLocalizedURL(LaravelLocalization::getCurrentLocale(), $link) .'">' . $node->name  .'</a>';
        }

    
        $target = '';
        if ($node->external_link != '') {
            $link = $node->external_link;
            $target = ' target="_blank"';
            $single  = '<a href="'.  $link .'" '. $target .'>' . $node->name  .'</a>';
        }
        //dd($node->getAncestorsAndSelf()->lists('slug'));
       // $link =  implode('/',$node->getAncestorsAndSelf()->lists('slug'));
       //echo $node->morpher_id;
       //echo $node->morpher->id;
        $active = '';
        $path = '/' . preg_replace('/\/edit$/', '', $path);
        //echo($path);

        if ($path == $link) {
            $active = ' class="active"';
        }
        $drop_down = '<a class="dropdown-toggle" data-toggle="dropdown" href="/#"
                        role="button" aria-expanded="false">' . $node->name . ' ' . $caret . '</a>';
        // $single  = '<a href="'. LaravelLocalization::getLocalizedURL(LaravelLocalization::getCurrentLocale(), $link) .'" '. $target .'>' . $node->name  .'</a>';
        if ($node->isLeaf()) {
            return '<li' . $active .'>' . $single . '</li>';
        } else {
            $html = '<li '.$class.'>' . $drop_down;
            $html .= '<ul '.$list.'>';
            foreach ($node->children as $child) {
                $html .= renderMainMenu($child, $path, $link);
            }
            $html .= '</ul>';
            $html .= '</li>';
        }
        return $html;
    }
}


if (!function_exists('renderEditorMenus')) {
    /**
     * Render nodes for nested sets
     *
     * @param $node
     * @param $resource
     * @return string
     */
    function renderEditorMenus($node, $editorLocale, $slug = null)
    { 
        if(empty($slug)) {
            if(config('app.fallback_locale') !== $editorLocale) {
                $slug .= '/' . $editorLocale;
            }
        }
        $id = 'data-id="' . $node->id .'"';
        $list = 'class="dd-list"';
        $class = 'class="dd-item"';
        $handle = 'class="dd-handle"';
        $slug .= '/' . $node->slug;
        $target = '';
        if ($node->external_link != '') {
            $slug = $node->external_link;
            $target = ' target="_blank"';
        }
        //$name  = '<span class="ol-buttons"> ' . get_ops($resource, $node->id, 'inline') . '</span>';

        $active = ($node->active == 1) ? 'fa-circle' : 'fa-circle-o';
        $active_data = ($node->active == 1) ? 0 : 1;

        $actions =  '<div class="btn-group pull-right" role="group" aria-label="...">' .
                    '<button type="button" class="btn btn-link btn-xs load" data-toggle="tooltip" title="load in Browser">' .
                        '<i class="fa fa-external-link" data-url="' . $slug . '" data-target="' . $target . '"></i>' .
                    '</button>' .
                    '<button type="button" class="btn btn-link btn-xs edit" title="settings">' .
                        '<i class="fa fa-gear"></i>' .
                    '</button>';

            if(config('app.fallback_locale') == $editorLocale) {
                $actions .=     
                    '<button type="button" class="btn btn-link btn-xs toggleActive" title="status">' .
                        '<i class="fa ' . $active . '" data-active="' . $active_data . '"></i>' .
                    '</button>' .
                    '<button type="button" class="btn btn-link btn-xs delete" title="delete">' .
                        '<i class="fa fa-times"></i>' .
                    '</button>';
            }
        $actions .= '</div>';

        $name  = '<div '.$handle.'><i class="fa fa-arrows"></i></div>';
        $name  .= '<div class="dd-content">' . $node->name . $actions . '</div>';
        
        if ($node->isLeaf()) {
            return '<li '.$class.' '.$id.'>' . $name . '</li>';
        } else {
            $html = '<li '.$class.' '.$id.'>' . $name;
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

if (!function_exists('renderEditorPages')) {
    /**
     * Render nodes for nested sets
     *
     * @param $node
     * @param $resource
     * @return string
     */
    function renderEditorPages($page, $editorLocale)
    {
        $id = 'data-id="' . $page->id .'"';
        $list = 'class="dd-list"';
        $class = 'class="dd-item"';
        $delete = '<button type="button" class="btn btn-link btn-xs delete" data-toggle="tooltip" title="delete"><i class="fa fa-fw fa-times"></i></button>';
        if ($page->id == 1) {
            $delete = '<button type="button" class="btn btn-link btn-xs"><i class="fa fa-fw"></i></button>';
        }

        $actions =  '<div class="btn-group pull-right" role="group" aria-label="...">' .
                    '<button type="button" class="btn btn-link btn-xs load" data-toggle="tooltip" title="load in Browser">' .
                        '<i class="fa fa-external-link" data-url="/page/' . $page->slug . '"></i>' .
                    '</button>' .
                    '<button type="button" class="btn btn-link btn-xs settings" data-toggle="tooltip" title="settings">' .
                        '<i class="fa fa-gear"></i>' .
                    '</button>';
            if(config('app.fallback_locale') == $editorLocale) {
                $actions .=     '<button type="button" class="btn btn-link btn-xs duplicate" data-toggle="tooltip" title="duplicate">' .
                                    '<i class="fa fa-copy"></i>' .
                                '</button>' .
                                $delete;
            } 
        $actions .= '</div>';

        $name  = '<div class="dd-content"><span class="dd-title">' . $page->title . '</span>' . $actions . '</div>';

        return '<li '.$class.' '.$id.'>' . $name . '</li>';
    }
}

if (!function_exists('buildLanguageSwitcher')) {
    /**
     * Render nodes for nested sets
     *
     * @param $node
     * @param $resource
     * @return string
     */
    function buildLanguageSwitcher($slugs)
    {
        $html = "";
        foreach ($slugs as $key => $slug) {
            $links = $slug;
            foreach ($links as $lang => $value) {
                if($lang == config('app.fallback_locale')) {
                    $link = $value;
                    //echo $link;
                } else {
                    $link = $lang . '/' .$value;
                }
                $active = '';
                if($lang == config('app.locale')) {
                    $active = 'class="active"';
                }
                
                $html .= '<li ' . $active . '>' .'<a rel="alternate" hreflang="' . $lang . '" href="/' . $link . '">' . $lang . '</a></li>';
            }
        }
        return $html;
    }
}