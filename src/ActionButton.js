// ActionButton.js

var SourceButton = cc.Node.extend({
	_sprite: null,
	_rect: null,
	_delegate: null,
	_type: null,
	rect:function(){
		var size = this._sprite.getContentSize();
		return cc.rect(-size.width / 2, -size.height / 2, size.width, size.height);
	},

	init:function(image){
		this._super();
		this._sprite = cc.Sprite.createWithSpriteFrameName(image);
		this.addChild(this._sprite);
		return true;
	},
	setDelegate:function(delegate){
		this._delegate = delegate;
	},
	setType:function(at){
		this._type = at;
	},
	getType:function(){
		return this._type;
	},
	onEnter:function(){
		this._super();
		// cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, false);
		// 2.1.5 to 2.1.6		
		cc.registerTargetedDelegate(0, true, this);
	},
	onExit:function(){
		this._super();
		// cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
		cc.unregisterTouchDelegate(this);
	},
	containsTouchLocation:function(touch){
		return cc.rectContainsPoint(this.rect(), this.convertTouchToNodeSpace(touch));
	},
	onTouchBegan:function(touch, event){
		// 区域判断
		if (!this.containsTouchLocation(touch))
			return false;
		this.click();
		// 播放点击动画
		return true;
	},
	click:function(){
		if(this._delegate){
			this._delegate.attackButtonClick(this.getType());
			this.beganAnimation();			
		}
	},
	onTouchEnded:function(touch, event){
		this.endedAnimation();
	},
	beganAnimation:function(){
        var scaleActionA=cc.ScaleTo.create(0,1.2,1.2);
        var scaleActionB=cc.ScaleTo.create(0.5,1,1);
        this._sprite.runAction(cc.Sequence.create(scaleActionA,scaleActionB));
	},
	endedAnimation:function(){
	},
	isCanClick:function(){
		return true;
	}
});

var TargetButton = cc.Node.extend({
    _pt: null,
    _ac: null,
    init:function(image){
        this._sprite = cc.Sprite.createWithSpriteFrameName(image);
        this._pt = cc.ProgressTimer.create(this._sprite);

        this._pt.setType(cc.PROGRESS_TIMER_TYPE_RADIAL);
        this._pt.setReverseDirection(true);
        this._pt.setScale(0.8);
        //this._pt.setMidpoint(1,1);
        this._pt.setPercentage(100);
        this.addChild(this._pt);
        return true;
    },
    beganAnimation:function(){
        cc.log("beganAnimation");
        var to = cc.ProgressTo.create(2, 100);
        this._pt.runAction(cc.RepeatForever.create(to.clone()));
        this._isCanClick = false;
    },
    endAnimation:function(){
        this._pt.stopAllActions();
    }
});
SourceButton.initWithImage = function(image){
    var ab = new SourceButton();
    if (ab && ab.init(image)){
        return ab;
    }
    return null;
};

TargetButton.initWithImage = function(image){
    var ae = new TargetButton();
    if (ae && ae.init(image))
        return ae;
    return null;
};


