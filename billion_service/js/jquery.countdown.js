(function($){
    var countdown = function(item, config)
    {
        var seconds = parseInt($(item).attr(config.attribute));
        var timer = null;
        var doWork = function()
        {
            if(seconds >= 0)
            {
                if(typeof(config.callback) == "function")
                {
                    var data = {
                        total : seconds ,
                        second : parseInt((seconds % 60),10) ,
                        minute : parseInt((seconds / 60) % 60,10) ,
                        hour : parseInt((seconds / 3600) % 24,10) ,
                        day : parseInt((seconds / 86400),10)
                    };
                    config.callback.call(item, seconds, data, item);
                }
                seconds --;
            }else{
                window.clearInterval(timer);
            }
        }
        timer = window.setInterval(doWork, 1000);
        doWork();
    };
    var main = function()
    {
        var args = arguments;
        var config = { attribute : 'data-seconds', callback : null };
        if(args.length == 1)
        {
            if(typeof(args[0]) == "function") config.callback = args[0];
            if(typeof(args[0]) == "object") $.extend(config, args[0]);
        }else{
            config.attribute = args[0];
            config.callback = args[1];
        }
        $(this).each(function(index, item){
            countdown.call(item, item, config);
        });
    };
    $.fn.countdown = main;
})(jQuery);