var Zoo = cc.Layer.extend({
	isMouseDown:false,
    sprite:null,
    btnLayer:null,
    btnArr:null,
    letter:'',
    length:6,
    ctor:function (letter,length) {
        this._super(cc.c4b(0,0,0,255), cc.c4b(98,99,117,255) );

        //if(!letter) return false;
        if(arguments.length>1){
            this.length=length;
        }else{
            this.length=letter.length*2;
        }
        this.letter=letter.toString().toUpperCase();
        cc.log("letter:"+this.letter);
    },
    init:function () {
        this._super();

        var wSize = cc.Director.getInstance().getWinSize();
        this._createMenu(wSize.width);


        var label = cc.LabelTTF.create(this.letter, "Arial", 50);
        label.setPosition(cc.p(wSize.width / 2, 0));
        label.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, wSize.height - 40)),cc.TintTo.create(2.5,255,125,0)));
        this.addChild(label, 5);

        this.sprite = cc.Sprite.create("res/"+this.letter.toLowerCase()+".jpg");
        this.sprite.setAnchorPoint(cc.p(0, 1));
        this.sprite.setPosition(0, wSize.height);
        this.sprite.setScaleY(wSize.height/(2*this.sprite.getContentSize().height));
        this.sprite.setScaleX(wSize.width/this.sprite.getContentSize().width);
        this.addChild(this.sprite, 0);

        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_pathTile);

        btnLayer = cc.LayerColor.create(cc.c4b(255, 255, 0, 255), wSize.width, wSize.height/2);
        //btnLayer = cc.LayerColor.create();
        btnLayer.setPosition(cc.p(0, 0));
        this.addChild(btnLayer);

        var width=(wSize.width-this.letter.length*(80)+10)/2;
        var height=btnLayer.getContentSize().height*4/5;

        this.btnArr=[];
        for(i=0;i<this.letter.length;i++){
            var button=TargetButton.initWithImage(this._getFileName("blank"));
            button.setTag(this.letter.charAt(i));
            if(i==0) button.beganAnimation();
            width=width+80;
            button.setPosition(cc.p(width,height));
            btnLayer.addChild(button);
            this.btnArr.push(button);
        }
        var list_letters=this._initLetterList(this.letter,this.length);
        width=(wSize.width-this.length*(80)+10)/2;
        height=btnLayer.getContentSize().height*2/5;
        for(var i=0;i<list_letters.length;i++){
            button=SourceButton.initWithImage(this._getFileName(list_letters[i]));
            button.setDelegate(this);
            button.setType(list_letters[i]);
        	width=width+80;
            button.setPosition(cc.p(width,height));
            btnLayer.addChild(button);
        }


        this.setTouchEnabled(true);
        return true;
    },
    _createMenu:function (width){
    var item1 = cc.MenuItemImage.create(s_pathB1, s_pathB2, this.onBackCallback, this);
    var item2 = cc.MenuItemImage.create(s_pathR1, s_pathR2, this.onRestartCallback, this);
    var item3 = cc.MenuItemImage.create(s_pathF1, s_pathF2, this.onNextCallback, this);
    var menu = cc.Menu.create(item1, item2, item3);
    menu.setPosition(0,0);
    var cs = item2.getContentSize();
    item1.setPosition( width/2 - cs.width*2, cs.height/2 );
    item2.setPosition( width/2, cs.height/2 );
    item3.setPosition( width/2 + cs.width*2, cs.height/2 );

    this.addChild(menu, 102, 10);
    },
    attackButtonClick:function (type){
        if(type){
            var name=this._getFileName(type);
            //var sprite=btnLayer.getChildByTag(type);
            var target=this.btnArr.shift();
            if(target && target.getTag()==type){
                var source = cc.Sprite.createWithSpriteFrameName(name);
                source.setPosition(target.getPosition());
                btnLayer.addChild(source);
                btnLayer.removeChild(target);

                if(this.btnArr.length==0){
                    this._createParticleExplosion();
                }else{
                    this.btnArr[0].beganAnimation();
                }
            }else{
                this.btnArr.unshift(target);
            }
        }
    },
    _createParticleExplosion:function(){
        var emitter = cc.ParticleExplosion.create();
        emitter.setTexture(cc.TextureCache.getInstance().addImage(s_stars1));
        if (emitter.setShapeType)
            emitter.setShapeType(cc.PARTICLE_STAR_SHAPE);

        emitter.setAutoRemoveOnFinish(true);

        this.addChild(emitter,10);
    },
    _getFileName:function (t){
        return s_tileName.replace('{0}',t);
    },
    _initLetterList:function (name,length){
        var len=name.length,arr=[], c,i;
        for(i=0;i<name.length;i++){
            c=name.charAt(i).toUpperCase();
            if(arr.indexOf(c)==-1){
              arr.push(c);
            }
        }
        if(arr.length>=length) return arr;
        for(i=arr.length;i<length;i++){
            c=arr_letters[Math.floor(Math.random()*arr_letters.length)];
            if(arr.indexOf(c)==-1){
               arr.push(c);
            }else{
                i--;
            }
        }
        arr.sort();
        return arr;
    },
    onRestartCallback:function (sender) {
        // override me
    },
    onNextCallback:function (sender) {

        cc.Director.getInstance().replaceScene(animals[index]);
        ++index;
       index=index%animals.length;
    },
    onBackCallback:function (sender) {
        cc.Director.getInstance().replaceScene(animals[index]);
        if(--index<0)index+=animals.length;
    }
});


var ZooScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Zoo("zoo",6);
        layer.init();
        this.addChild(layer);
    }
});

var CatScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Zoo("cat",6);
        layer.init();
        this.addChild(layer);
    }
});

var DogScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Zoo("dog",6);
        layer.init();
        this.addChild(layer);
    }
});


