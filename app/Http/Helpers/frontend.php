<?php

if (! function_exists('renderMainMenu')) {
    /**
     * Render nodes for nested sets.
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
        if ($node->slug == 'home') {
            $link .= LaravelLocalization::getLocalizedURL($locale = null, $url = '/');
            $single = '<a href="'.LaravelLocalization::getLocalizedURL(LaravelLocalization::getCurrentLocale(), $link).'">'.$node->name.'</a>';
        } else {
            $locale = LaravelLocalization::getCurrentLocale();
            if ($locale != config('app.fallback_locale') && $node->isRoot()) {
                $link .= '/'.LaravelLocalization::getCurrentLocale().'/'.$node->slug;
            } else {
                $link .= '/'.$node->slug;
            }

            $single = '<a href="'.LaravelLocalization::getLocalizedURL(LaravelLocalization::getCurrentLocale(), $link).'">'.$node->name.'</a>';
        }

        $target = '';
        if ($node->external_link != '') {
            $link = $node->external_link;
            $target = ' target="_blank"';
            $single = '<a href="'.$link.'" '.$target.'>'.$node->name.'</a>';
        }
        //dd($node->getAncestorsAndSelf()->pluck('slug'));
        // $link =  implode('/',$node->getAncestorsAndSelf()->pluck('slug'));
        //echo $node->morpher_id;
        //echo $node->morpher->id;
        $active = '';
        $path = '/'.preg_replace('/\/edit$/', '', $path);
        //echo($path);

        if ($path == $link) {
            $active = ' class="active"';
        }
        $drop_down = '<a class="dropdown-toggle" data-toggle="dropdown" href="/#"
                        role="button" aria-expanded="false">'.$node->name.' '.$caret.'</a>';
        // $single  = '<a href="'. LaravelLocalization::getLocalizedURL(LaravelLocalization::getCurrentLocale(), $link) .'" '. $target .'>' . $node->name  .'</a>';
        if ($node->isLeaf()) {
            return '<li'.$active.'>'.$single.'</li>';
        } else {
            if (count($node->children) > 0) {
                $html = '<li '.$class.'>'.$drop_down;
                $html .= '<ul '.$list.'>';
                foreach ($node->children as $child) {
                    $html .= renderMainMenu($child, $path, $link);
                }
                $html .= '</ul>';
                $html .= '</li>';
            } else {
                $html = '<li'.$active.'>'.$single.'</li>';
            }
        }

        return $html;
    }
}

if (! function_exists('buildLanguageSwitcher')) {
    /**
     * Render nodes for nested sets.
     *
     * @param $node
     * @param $resource
     * @return string
     */
    function buildLanguageSwitcher($slugs)
    {
        $html = '';
        foreach ($slugs as $key => $slug) {
            $links = $slug;
            foreach ($links as $lang => $value) {
                if ($lang == config('app.fallback_locale')) {
                    $link = $value;
                    //echo $link;
                } else {
                    $link = $lang.'/'.$value;
                }
                $active = '';
                if ($lang == config('app.locale')) {
                    $active = 'class="active"';
                }

                $html .= '<li '.$active.'>'.'<a rel="alternate" hreflang="'.$lang.'" href="/'.$link.'">'.$lang.'</a></li>';
            }
        }

        return $html;
    }
}
