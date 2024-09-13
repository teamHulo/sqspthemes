<script>

    const values = {
    path: '/blog-2-1',
    addToItem: true
};
</script>

<style>
  :root{
  --arrow: url('data:image/svg+xml,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 7L15 12L10 17" stroke="%236d6464" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
}

</style>

<script>
  
       (function(path, itemVisible){
         let collectionId;
         const arrOfHtml = [];
         
       	   const utils = (function () {
        function getParentEl(el, tagName) {
            let searchEl = el;

            while (searchEl.parentElement) {
                if (searchEl.parentElement.tagName.toLowerCase() === tagName.toLowerCase()) {
                    return searchEl.parentElement;
                }

                searchEl = searchEl.parentElement;
            }

            return null;
        }

        function setAttrParents(attr, tag) {
            let list = document.querySelectorAll(`[${attr}]`);
            list.forEach((el) => {
                const tagEl = getParentEl(el, tag);

                if (!tagEl) {
                    return;
                }
                tagEl.setAttribute(attr, '');
            })
        }

        function fetchData(path) {
            const url = document.location.origin + path + '?format=json-pretty';

            return fetch(url)
                .then((response) => response.json())
        }

        return {
            setAttrParents, fetchData
        };
    })();
    
	function calculateReadingTime(text) {
      const words = text.split(/\s+/).filter(Boolean).length;
      const readingSpeed = 150;
      const readingTime = Math.ceil(words / readingSpeed);
      
		return readingTime;
	}
    
            utils.fetchData(path)
                .then((dataList) => {
                    const data = buildContent(dataList.items);
                    collectionId = dataList.collection.id;
                    findBlogSections(collectionId, data);
                    
              if(itemVisible) {
                 renderTimeInItems(collectionId, data);
              }
                });
    
    function buildContent(items) {

    	items.forEach((item) => {
         
          	const url = item.fullUrl;
        	const body = item.body;
          	const container = document.createElement('div');
          	container.innerHTML = body;
            const id = item.id;
          	
            let string = '';
          	const elements = container.querySelectorAll('p, span, h1, h2, h3, h4');
          
          elements.forEach(element => {
             string += element.textContent.replace(/\s+/g, ' ').trim();
          }); 
          
          const readingTime = calculateReadingTime(string);
          
          arrOfHtml.push({id, url, readingTime});
        })
   
             return arrOfHtml;
    }
         
         
         function findBlogSections(id, data) {
         
           const summaries = document.querySelectorAll('.summary-v2-block');
           
           summaries.forEach((summary) => {
           const parseData = JSON.parse(summary.getAttribute('data-block-json'));
           
           if(parseData.collectionId === id) {
              fingingBlogItemInSUmmary(summary, data);
              summary.classList.add('blog-reading-time');
           }
         }) 
           
           const bodyBlog = document.querySelector(`.collection-${collectionId}.view-list`);
          
           if(bodyBlog) {
              bodyBlog.querySelector('.content-collection').classList.add('blog-reading-time');
              fingingBlogItemInBlogPage(bodyBlog, data);
          } 
           
   }
   
         function fingingBlogItemInBlogPage(searchList, values) {
         	const items = searchList.querySelectorAll('article');
            
            items.forEach((item) => {
                const link = item.querySelector('a');
            	const href = link.getAttribute('href');
            
                
                values.forEach((el) => {
                  if(el.url === href) {
                  	item.setAttribute('data-reading-time', `${el.readingTime} min read`);
                  }
                })
            })
         }
         
          function fingingBlogItemInSUmmary(searchList, values) {
            const items = searchList.querySelectorAll('.summary-item');
            
            items.forEach((item) => {
                const link = item.querySelector('a');
            	const href = link.getAttribute('href');
               
                values.forEach((el) => {
                  if(el.url === href) {
                  	item.setAttribute('data-reading-time', `${el.readingTime} min read`);
                  }
                })
            })
         }
         
	    function renderTimeInItems(collection, data) {
        

          data.forEach((el) => {
          	if(document.body.getAttribute('id').includes(el.id)) {
                document.body.classList.add('blog-reading-time-item');
                const article = document.body.querySelector('.blog-item-inner-wrapper');
                article.setAttribute('data-reading-time', `${el.readingTime} min read`);
            }
          })
         
        }
         
         function createValuesList(list) {
         	return list;
         } 
         
    
})(values.path, values.addToItem)
    
</script>
