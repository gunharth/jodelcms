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
        $link .= '/' . $node->slug;
        $target = '';
        if($node->external_link != '') {
            $link = $node->external_link;
            $target = ' target="_blank"';
        }
        //dd($node->getAncestorsAndSelf()->lists('slug'));
       // $link =  implode('/',$node->getAncestorsAndSelf()->lists('slug'));
       //echo $node->morpher_id;
       //echo $node->morpher->id;
        $active = '';
        $path = '/' . preg_replace('/\/edit$/', '', $path);
        if($path == $link) {
            $active = ' class="active"';
        }
        $drop_down = '<a class="dropdown-toggle" data-toggle="dropdown" href="/#"
                        role="button" aria-expanded="false">' . $node->name . ' ' . $caret . '</a>';
        $single  = '<a href="'. $link .'" '. $target .'>' . $node->name  .'</a>';
        if ($node->isLeaf()) {
            return '<li' . $active .'>' . $single . '</li>';
        } else {
            $html = '<li '.$class.'>' . $drop_down;
            $html .= '<ul '.$list.'>';
            foreach ($node->children as $child) {
                $html .= renderMainMenu($child,$path, $link);
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
    function renderEditorMenus($node, $slug = null)
    {
        $id = 'data-id="' . $node->id .'"';
        $list = 'class="dd-list"';
        $class = 'class="dd-item"';
        $handle = 'class="dd-handle"';
        $slug .= '/' . $node->slug;
        $target = '';
        if($node->external_link != '') {
            $slug = $node->external_link;
            $target = ' target="_blank"';
        }
        //$name  = '<span class="ol-buttons"> ' . get_ops($resource, $node->id, 'inline') . '</span>';
        
        $active = ($node->active == 1) ? 'fa-circle' : 'fa-circle-o';
        $active_data = ($node->active == 1) ? 0 : 1;
        $actions = '<div class="btn-group pull-right" role="group" aria-label="...">' .
                   '<a href="' . $slug . '" ' . $target . ' class="btn btn-xs"><i class="fa fa-external-link"></i></a>' .
                   '<button type="button" class="btn btn-link btn-xs edit"><i class="fa fa-pencil-square-o"></i></button>' .
                   '<button type="button" class="btn btn-link btn-xs toggleActive"><i class="fa ' . $active . '" data-active="' . $active_data . '"></i></button>' .
                   '<button type="button" class="btn btn-link btn-xs delete"><i class="fa fa-times"></i></button>' .
                   '</div>';
        $name  = '<div '.$handle.'><i class="fa fa-arrows"></i></div>';
        $name  .= '<div class="dd-content">' . $node->name . $actions . '</div>';
        
        if ($node->isLeaf()) {
            return '<li '.$class.' '.$id.'>' . $name . '</li>';
        } else {
            $html = '<li '.$class.' '.$id.'>' . $name;
            $html .= '<ol '.$list.'>';
            foreach ($node->children as $child) {
                $html .= renderEditorMenus($child,$slug);
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
    function renderEditorPages($page)
    {
        $id = 'data-id="' . $page->id .'"';
        $list = 'class="dd-list"';
        $class = 'class="dd-item"';
        $delete = '<button type="button" class="btn btn-link btn-xs delete" data-toggle="tooltip" title="delete"><i class="fa fa-fw fa-times"></i></button>';
        if($page->id == 1) {
            $delete = '<button type="button" class="btn btn-link btn-xs"><i class="fa fa-fw"></i></button>';
        }
        $actions = '<div class="btn-group pull-right" role="group" aria-label="...">' .
                    '<a href="/page/' . $page->slug  . '" class="btn btn-xs"><i class="fa fa-external-link"></i></a>' .
                   '<button type="button" class="btn btn-link btn-xs load" data-toggle="tooltip" title="load in Browser"><i class="fa fa-external-link" data-url="/page/' . $page->slug . '/edit"></i></button>' .
                   '<button type="button" class="btn btn-link btn-xs edit" data-toggle="tooltip" title="edit"><i class="fa fa-pencil-square-o"></i></button>' .
                   '<button type="button" class="btn btn-link btn-xs duplicate" data-toggle="tooltip" title="duplicate"><i class="fa fa-copy"></i></button>' .
                   $delete .
                   '</div>';
        $name  = '<div class="dd-content"><span class="dd-title">' . $page->title . '</span>' . $actions . '</div>';

        return '<li '.$class.' '.$id.'>' . $name . '</li>';
        
    }
}