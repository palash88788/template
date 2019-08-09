$(function(){
	// Initialize iCheck
  $('input').iCheck({
    checkboxClass: 'icheckbox_flat-purple',
    radioClass: 'iradio_flat-purple'
  });

  // Initialize Bootstrap Popover
  $('[data-toggle="popover"]').popover({
  	placement: 'auto',
  	html: true,
  	trigger: 'click'
  });

  // Clickable element with attribute data-href
  $("[data-href]").each(function() {
  	$(this).click(function() {
  		try {
	  		if(eval($(this).data('href'))){
		  		document.location = eval($(this).data('href'));
		  		return;
	  		}
  		} catch($e) {
	  		document.location = $(this).data('href');
  		}

  	});
  });

  // Trigger element to fadeIn or fadeOut
  $("[data-fade]").each(function() {
  	$(this).click(function() {
  		var $sel = $(this).data("fade"),
  				$in = $sel.split(",")[0],
  				$out = $sel.split(",")[1];

  		if($in) {
		  	$($in).fadeIn();
  		}
  		if($out) {
		  	$($out).fadeOut();
  		}
	  	return false;
  	});
  });

  // Trigger element to slideDown or slideUp
  $("[data-slide]").each(function() {
  	$(this).click(function() {
  		var $sel = $(this).data("slide"),
  				$in = $sel.split(",")[0],
  				$out = $sel.split(",")[1];

			if($(this).data("active")) {
		  		$($(this).data("active")).toggleClass("active");
			}

  		if($in) {
		  	$($in).slideToggle();
  		}
  		if($out) {
		  	$($out).slideToggle();
  		}
	  	return false;
  	});
  });

  $("[data-shipping-method]").each(function() {
  	$(this).click(function() {
  		$("[data-shipping-method]").removeClass("active");
  		$(this).addClass("active");
  		setShipping($(this).find("input:radio").val());
  	});
  });

  $(".payment-method-item").each(function() {
  	$(this).click(function() {
  		$(".payment-method-item").removeClass("active");
  		$(this).addClass("active");

  		$(".payment-method-form").removeClass('show').hide();
  		$("#" + $(this).data("target")).fadeIn();
  	});
  });

  $(".items .item").each(function() {
  	var $this = $(this);

  	$this.find(".close").click(function() {
  		$this.fadeOut(function() {
  			$(this).remove();
  			calculateOrder();
  			calculateTotal();
  		});
  	});
  });

  $("#coupon-form").submit(function() {
  	setDiscount(20);
  	return false;
  })

  var currency = function(price) {
  	price = number_format(price, config.currency.decimal);
  	if(config.currency.position == 'right') {
  		price += config.currency.prefix;
  	}else if(config.currency.position == 'left') {
  		price = config.currency.prefix + price;
  	}
  	return price;
  }

  var getPrice = function(res) {
  	res = res.replace(/,/g, '');
  	res = res.replace(config.currency.prefix, '');
  	res = parseFloat(res);
  	return res;
  }

  if(config.currency.onload == true) {
  	$(config.currency.selector).each(function() {
  		var $this = $(this),
  				$val = $this.html();
  		$this.html(currency($val));
  	});
  }

	$("[data-quantity-control]").each(function() {
		var $this = $(this),
				$min = $this.data("min"),
				$max = $this.data("max"),
				$target = $($this.data("target")),
				$price = getPrice($target.html());

		$this.find(".control").on("click", function() {
			var $control = $(this),
					$count = $control.parent().find(".count span"),
					$countNow = parseInt($count.html()),
					count = 0;

			if($control.hasClass("min")) {
				count = $countNow - 1;
				if(count <= $min) {
					count = $min;
				}
			}else if($control.hasClass("plus")) {
				count = $countNow + 1;
				if(count >= $max) {
					count = $max;
				}
			}else{
				return false;
			}
			calculate($target, count, $price);
			$count.html(count);
		});

		var calculate = function($target, $count, $price) {
			$target.html(currency($price * $count));

			calculateOrder();
			calculateTotal();
		}
	});

	var _calculate = 0;
	var calculateOrder = function() {
		var $order = $("#total-order");

		$(".items .item .item-price").each(function(){
			var $item = $(this);
			_calculate += getPrice($item.find(".value").html());
		});
		$order.html(currency(_calculate));		
		_calculate = 0;
	}

	var calculateTotal = function() {
		var $total = $(config.calculate.wrapper),
				_calculate = 0;

		$total.find(config.calculate.item+":not("+config.calculate.except+")").each(function() {
			var $item = $(this);
			if($item.attr("data-calculate-min")) {
				_calculate -= getPrice($item.find(".total-value").html());
			}else{
				_calculate += getPrice($item.find(".total-value").html());
			}
		});

		$total.find(config.calculate.total).html(currency(_calculate));
	}

	var setDiscount = function(price) {
		if(price == false) {
			price = 0;
		}
		$(config.calculate.wrapper).find(config.calculate.discount).html(currency(price));
		calculateTotal();
	}

	var setTax = function(price) {
		if(price == false) {
			price = 0;
		}
		$(config.calculate.wrapper).find(config.calculate.tax).html(currency(price));
		calculateTotal();
	}

	var setShipping = function(price) {
		if(price == false) {
			price = 0;
		}
		$(config.calculate.wrapper).find(config.calculate.shipping).html(currency(price));
		calculateTotal();
	}

	calculateTotal();
});
