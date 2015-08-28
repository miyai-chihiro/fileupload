
  //サムネイルを投稿する
  var Fileupload = function(_options){
    this.postedfile = $('.file-posted');
    $.extend(true,this,_options);
    this.initChangeEvents();
  };
  Fileupload.prototype.initChangeEvents = function(){
    var self = this;
    this.btn.on('change','input',function(e){
      if(self.checkFileApiSupport()){
        self.readImageFile(e.target.files);
        self.btn.val('');
      };
    });
  };
  Fileupload.prototype.readImageFile = function(_files){
    var self = this;
    $(_files).each(function(_i,_file){
      if(_file.type.indexOf('image') >= 0){
        var reader = new FileReader();
        //ファイルの読み込みが完了したら
        reader.onload = function(e){
          self.imageFile = {
            name : _file.name,
            lastModified: _file.lastModified,
            url: e.target.result
          };
          //追加した画像をDOMに追加
          self.renderThumb();
          self.setThumbLayout();
          self.toggleThumbDisplay();
          self.callback && self.callback();
        };
        //ファイルの内容を取得
        reader.readAsDataURL(_file);
      };
    });
  };
  Fileupload.prototype.checkFileApiSupport = function(){
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      console.log('[COMMENT] All the File APIs are supported.');
      return true;
    } else {
      alert('The File APIs are not fully supported in this browser.');
      return false;
    }
  };
  Fileupload.prototype.renderThumb = function(){
    this.thumb = $(this.template);
    $(this.thumb).find('img')
                    .attr('src',this.imageFile.url)
                    .attr('role','posted-file');
    this.renderWrapper.append(this.thumb);
  },
  Fileupload.prototype.toggleThumbDisplay = function(){
    $(this.btn).css('display',(this.renderWrapper.find('img[role=posted-file]').length >= this.limit) ? 'none' : 'block');
  },
  Fileupload.prototype.setThumbLayout = function(){
    var _img = new Image(),
        _imgWidth,
        _imgHeight,
        _thumbLeft;

    _img.src = this.imageFile.url;
    _imgWidth = _img.width;
    _imgHeight = _img.height;

    this.thumb.find('img').attr('height',(_imgWidth > _imgHeight) ? this.thumb.innerHeight() : 'auto');
    this.thumb.find('img').attr('width',(_imgWidth > _imgHeight) ? 'auto' : this.thumb.innerWidth());

    //画像センタリング
    _thumbLeft = this.thumb.innerWidth()/2 - ((_imgWidth > _imgHeight) ? this.thumb.find('img').innerHeight()/2 : this.thumb.find('img').innerWidth()/2)
    this.thumb.find('img').css('margin-left',_thumbLeft + 'px');
  }

