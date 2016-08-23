 <footer class="footer">
      <div class="container">
         <ul class="nav navbar-nav">
            @foreach($menu->toHierarchy() as $node)
                {!! renderMainMenu($node, Request::path()) !!}
            @endforeach
            <li><a href="/sitemap.xml">Sitemap</a></li>
        </ul>
      </div>
    </footer>