 <footer class="footer">
      <div class="container">
         <ul class="nav navbar-nav">
            @foreach($menu->toHierarchy() as $node)
                {!! renderMainMenu($node, Request::path()) !!}
            @endforeach
        </ul>
      </div>
    </footer>