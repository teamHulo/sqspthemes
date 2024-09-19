(function(path, isDisplayDate, titleLength){
	
        let collectionId;
    
  	fetch(document.location.origin + path +'?format=json-pretty')

            .then(response => response.json())
            .then(data => { 
          
   		       collectionId = data.collection.id;
        		const blogList = buildList(data);
          		setPaginationImg(blogList);
		
        })
	

function trimTitles() {
	const blog = document.querySelector('.blog-img-pagination');
	const titles =  blog.querySelectorAll('.item-pagination-title ');
	titles.forEach((title) => {
	  const innerTitle = (title.innerHTML).slice(0, titleLength) + "...";
	  title.innerHTML = innerTitle;	
	})
}
  
  function buildList(data) {
	const blogList = [];
    
  	for (let i = 0; i < data.items.length; i++) {
      	let prevIndex;
      	let nextIndex;
      
      	
      if(i === 0) {
        	prevIndex = data.items.length-1
        } else {
        	prevIndex = i - 1
        }
      
       if(i === data.items.length-1) {
        	nextIndex = 0
        } else {
        	nextIndex = i + 1;
        }
      
      const datePrev = (new Date(data.items[prevIndex].updatedOn)).toLocaleString(); 
      const dateNext = (new Date(data.items[nextIndex].updatedOn)).toLocaleString(); 
      const dateCurrent = (new Date(data.items[i].updatedOn)).toLocaleString(); 
           
    	blogList.push({id: data.items[i].id, urlPrev: data.items[prevIndex].assetUrl, urlNext: data.items[nextIndex].assetUrl, datePrev, dateNext, dateCurrent})
    }
    
    	return blogList;
  }
    
    
    function dateFormating(dateString) {
    	 const [day, month, year] = dateString.split(", ")[0].split(".");
          const date = new Date(`${year}-${month}-${day}`);
          const options = { month: 'short', day: 'numeric', year: 'numeric' };
          return date.toLocaleDateString('en-US', options);
    }
    
  
      function setPaginationImg (list) {
       
       document.querySelector(`.collection-${collectionId}.view-item`).classList.add('blog-img-pagination')
       const blogItem =  document.querySelector(`.collection-${collectionId}.view-item .blog-item-wrapper`);
       const root = document.documentElement;
       
    if (blogItem){
      const blogItemImgSrc = document.head.querySelector("[property='og:image']").content; 
      const blogId = document.body.getAttribute('id');
      root.style.setProperty('--project-bg', `url(${blogItemImgSrc})`);
      //document.querySelector('.blog-img-pagination .h-entry').style.opacity = '1';
      trimTitles();
	    
      list.forEach((el, i) => {
	     
        if(blogId.includes(el.id)){
           let urlPrev = el.urlPrev;
           let urlNext = el.urlNext;
           
           let datePrev = dateFormating(el.datePrev);
           let dateNext = dateFormating(el.dateNext);
  
          if(isDisplayDate) {
          	  root.style.setProperty('--date-prev', `"${datePrev}"`);
              root.style.setProperty('--date-next', `"${dateNext}"`);
          }
          
          root.style.setProperty('--blog-pagination-prev', `url(${urlPrev})`);
          root.style.setProperty('--blog-pagination-next', `url(${urlNext})`);
   
           }
      	})
    	}
      }   
  })(values.path, values.isDisplayDate, values.blogTitleLength)
