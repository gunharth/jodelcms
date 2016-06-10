<?php

if (!function_exists('renderMenuNode')) {
    /**
     * Render nodes for nested sets
     *
     * @param $node
     * @return string
     */
    function renderMenuNode($node)
    {
        $list = 'class="dropdown-menu"';
        $class = 'class="dropdown"';
        $caret = '<i class="fa fa-caret-down"></i>';
        //$link = route('page', ['page_slug' => $node->slug]);
        $link = $node->page->link;
        $drop_down = '<a class="dropdown-toggle" data-toggle="dropdown" href="'.$link.'"
                        role="button" aria-expanded="false">' . $node->name . ' ' . $caret . '</a>';
        $single  = '<a href="'. $link .'">' . $node->name  .'</a>';
        if ($node->isLeaf()) {
            return '<li>' . $single . '</li>';
        } else {
            $html = '<li '.$class.'>' . $drop_down;
            $html .= '<ul '.$list.'>';
            foreach ($node->children as $child) {
                $html .= renderMenuNode($child);
            }
            $html .= '</ul>';
            $html .= '</li>';
        }
        return $html;
    }
}

if (!function_exists('get_ops')) {
    /**
     * Returns resource operations for the datatables or nested sets
     *
     * @param $resource
     * @param $id
     * @param $class
     * @return string
     */
    function get_ops($resource, $id, $class = "btn")
    {
        if ($class=="btn") {
            $show_class = "btn btn-xs bg-navy";
            $edit_class = "btn btn-xs bg-olive";
            $delete_class = "btn btn-xs btn-danger destroy";
        } else {
            $show_class = "inline-show";
            $edit_class = "inline-edit";
            $delete_class = "inline-delete";
        }
        $show_path = route($resource.'.show', ['id' => $id]);
        $edit_path = route($resource.'.edit', ['id' => $id]);
        $delete_path = route($resource.'.destroy', ['id' => $id]);
        $ops  = '<ul class="list-inline no-margin-bottom">';
        $ops .=  '<li>';
        $ops .=  '<a class="'.$show_class.'" href="'.$show_path.'">
                  <i class="fa fa-search"></i>
                  show</a>';
        $ops .=  '</li>';
        $ops .=  '<li>';
        $ops .=  '<a class="'.$edit_class.'" href="'.$edit_path.'">
                 <i class="fa fa-pencil-square-o"></i>edit</a>';
        $ops .=  '</li>';
        $ops .=  '<li>';
        $ops .= Form::open(['method' => 'DELETE', 'url' => $delete_path]);
        $ops .= Form::submit('&#xf1f8; del', [
                'onclick' => "return confirm('".trans('admin.ops.confirmation')."');",
                'class' => $delete_class
            ]);
        $ops .= Form::close();
        $ops .=  '</li>';
        $ops .=  '</ul>';
        return $ops;
    }
}

if (!function_exists('renderNode')) {
    /**
     * Render nodes for nested sets
     *
     * @param $node
     * @param $resource
     * @return string
     */
    function renderNode($node)
    {
        $id = 'data-id="' . $node->id .'"';
        $list = 'class="dd-list"';
        $class = 'class="dd-item"';
        $handle = 'class="dd-handle"';
        //$name  = '<span class="ol-buttons"> ' . get_ops($resource, $node->id, 'inline') . '</span>';
        
        // $active = 'fa-circle';
        // if($node->active == 1) {
        //     $active = 'fa-circle';
        // }
        $active = ($node->active == 1) ? 'fa-circle' : 'fa-circle-o';
        $active_data = ($node->active == 1) ? 0 : 1;
        $actions = '<div class="btn-group pull-right" role="group" aria-label="...">' .
                   '<button type="button" class="btn btn-link btn-xs"><i class="fa fa-external-link"></i></button>' .
                   '<button type="button" class="btn btn-link btn-xs toggleActive"><i class="fa ' . $active . '" data-active="' . $active_data . '"></i></button>' .
                   '<button type="button" class="btn btn-link btn-xs delete"><i class="fa fa-times"></i></button>' .
                   '<button type="button" class="btn btn-link btn-xs"><i class="fa fa-gear"></i></button>' .
                   '</div>';
        $name  = '<div '.$handle.'><i class="fa fa-arrows"></i></div>';
        $name  .= '<div class="dd-content">' . $node->name . $actions . '</div>';
        
        if ($node->isLeaf()) {
            return '<li '.$class.' '.$id.'>' . $name . '</li>';
        } else {
            $html = '<li '.$class.' '.$id.'>' . $name;
            $html .= '<ol '.$list.'>';
            foreach ($node->children as $child) {
                $html .= renderNode($child);
            }
            $html .= '</ol>';
            $html .= '</li>';
        }
        return $html;
    }
}

if (!function_exists('renderPage')) {
    /**
     * Render nodes for nested sets
     *
     * @param $node
     * @param $resource
     * @return string
     */
    function renderPage($page)
    {
        $id = 'data-id="' . $page->id .'"';
        $list = 'class="dd-list"';
        $class = 'class="dd-item"';
        $delete = '<button type="button" class="btn btn-link btn-xs delete"><i class="fa fa-fw fa-times"></i></button>';
        if($page->id == 1) {
            $delete = '<button type="button" class="btn btn-link btn-xs"><i class="fa fa-fw"></i></button>';
        }
        $actions = '<div class="btn-group pull-right" role="group" aria-label="...">' .
                   '<button type="button" class="btn btn-link btn-xs"><i class="fa fa-pencil-square-o"></i></button>' .
                   '<button type="button" class="btn btn-link btn-xs"><i class="fa fa-circle"></i></button>' .
                   '<button type="button" class="btn btn-link btn-xs"><i class="fa fa-circle-o"></i></button>' .
                   '<button type="button" class="btn btn-link btn-xs"><i class="fa fa-gear"></i></button>' .
                   $delete .
                   '</div>';
        $name  = '<div class="dd-content">' . $page->title . $actions . '</div>';

        return '<li '.$class.' '.$id.'>' . $name . '</li>';
        
    }
}