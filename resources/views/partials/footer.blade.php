 <footer class="footer">
      <div class="container">
         <ul class="nav navbar-nav">
            @foreach($menu->toHierarchy() as $node)
                {!! renderMenuNode($node, Request::path()) !!}
            @endforeach
        </ul>
      </div>
    </footer>