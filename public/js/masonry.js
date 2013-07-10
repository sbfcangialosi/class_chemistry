
    $.Isotope.prototype._getCenteredMasonryColumns = function() {

      this.width = this.element.width();
      var parentWidth = this.element.parent().width();
      var colW = this.options.masonry && this.options.masonry.columnWidth || // i.e. options.masonry && options.masonry.columnWidth
      this.$filteredAtoms.outerWidth(true) || // or use the size of the first item
      parentWidth; // if there's no items, use size of container
      var cols = Math.floor(parentWidth / colW);
      cols = Math.max(cols, 1);
      this.masonry.cols = cols; // i.e. this.masonry.cols = ....
      this.masonry.columnWidth = colW; // i.e. this.masonry.columnWidth = ...
    };

    $.Isotope.prototype._masonryReset = function() {

      this.masonry = {}; // layout-specific props
      this._getCenteredMasonryColumns(); // FIXME shouldn't have to call this again
      var i = this.masonry.cols;
      this.masonry.colYs = [];
        while (i--) {
          this.masonry.colYs.push(0);
      }
    };

    $.Isotope.prototype._masonryResizeChanged = function() {

      var prevColCount = this.masonry.cols;
      this._getCenteredMasonryColumns(); // get updated colCount
      return (this.masonry.cols !== prevColCount);
    };

    $.Isotope.prototype._masonryGetContainerSize = function() {

      var unusedCols = 0,
      i = this.masonry.cols;
        while (--i) { // count unused columns
          if (this.masonry.colYs[i] !== 0) {
            break;
        }
        unusedCols++;
      }
      return {
        height: Math.max.apply(Math, this.masonry.colYs),
        width: (this.masonry.cols - unusedCols) * this.masonry.columnWidth // fit container to columns that have been used;
      };
    };

  $(function(){
    
    var $container = $('#container');
 
      // add randomish size classes
      $container.find('.element').each(function(){
        var $this = $(this),
            number = parseInt( $this.find('.number').text(), 10 );
        if ( number % 7 % 2 === 1 ) {
          $this.addClass('width2');
        }
        if ( number % 3 === 0 ) {
          $this.addClass('height2');
        }
      });
    
    $container.isotope({
      itemSelector : '.element',
      masonry : {
        columnWidth : 5
      },
      masonryHorizontal : {
        rowHeight: 70
      },
      cellsByRow : {
        columnWidth : 240,
        rowHeight : 240
      },
      cellsByColumn : {
        columnWidth : 240,
        rowHeight : 240
      },
      getSortData : {
        symbol : function( $elem ) {
          return $elem.attr('data-symbol');
        },
        category : function( $elem ) {
          return $elem.attr('data-category');
        },
        number : function( $elem ) {
          return parseInt( $elem.find('.number').text(), 10 );
        },
        weight : function( $elem ) {
          return parseFloat( $elem.find('.weight').text().replace( /[\(\)]/g, '') );
        },
        name : function ( $elem ) {
          return $elem.find('.name').text();
        }
      }
    });
    
    
      var $optionSets = $('#options .option-set'),
          $optionLinks = $optionSets.find('a');

      $optionLinks.click(function(){
        var $this = $(this);
        // don't proceed if already selected
        if ( $this.hasClass('selected') ) {
          return false;
        }
        var $optionSet = $this.parents('.option-set');
        $optionSet.find('.selected').removeClass('selected');
        $this.addClass('selected');
  
        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {},
            key = $optionSet.attr('data-option-key'),
            value = $this.attr('data-option-value');
        // parse 'false' as false boolean
        value = value === 'false' ? false : value;
        options[ key ] = value;
        if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
          // changes in layout modes need extra logic
          changeLayoutMode( $this, options )
        } else {
          // otherwise, apply new options
          $container.isotope( options );
        }
        
        return false;
      });


    
      // change layout
      var isHorizontal = false;
      function changeLayoutMode( $link, options ) {
        var wasHorizontal = isHorizontal;
        isHorizontal = $link.hasClass('horizontal');

        if ( wasHorizontal !== isHorizontal ) {
          // orientation change
          // need to do some clean up for transitions and sizes
          var style = isHorizontal ? 
            { height: '80%', width: $container.width() } : 
            { width: 'auto' };
          // stop any animation on container height / width
          $container.filter(':animated').stop();
          // disable transition, apply revised style
          $container.addClass('no-transition').css( style );
          setTimeout(function(){
            $container.removeClass('no-transition').isotope( options );
          }, 100 )
        } else {
          $container.isotope( options );
        }
      }
    
      // change size of clicked element, return all others to normal, so only one can be open at a time
      $container.delegate( '.element', 'click', function(){
        atoms = $container.data('isotope').$filteredAtoms
        
        atoms.removeClass('large')
        $(this).toggleClass('large');
        console.log()
        descs = document.getElementsByClassName("description");
        for(var i=0; i < descs.length; i++){descs[i].setAttribute('hidden')}
        atom_id = $(this).context.id
        document.getElementById(atom_id+"-info").removeAttribute('hidden');

        $container.isotope('reLayout');
        
      });

      // toggle variable sizes of all elements
      $('#toggle-sizes').find('a').click(function(){
        $container
          .toggleClass('variable-sizes')
          .isotope('reLayout');
        return false;
      });


    
      $('#insert a').click(function(){
        var $newEls = $( fakeElement.getGroup() );
        $container.isotope( 'insert', $newEls );

        return false;
      });

      $('#append a').click(function(){
        var $newEls = $( fakeElement.getGroup() );
        $container.append( $newEls ).isotope( 'appended', $newEls );

        return false;
      });
  });
