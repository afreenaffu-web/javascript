function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    console.log("draggable element id="+ev.target.id);
    let price=document.getElementById(ev.target.id).querySelector("#cost").innerHTML;
    console.log("price is "+price);
    
  }
  
  var table1=[];
  var table2=[];
  var table3=[];
 
  function drop(ev,target) {  
    ev.preventDefault();
    let dragId = ev.dataTransfer.getData("text");
    let dropId=target.id;
    console.log(dropId);
    
   let originaldata=document.getElementById(dropId).querySelector("#total").innerHTML;
   let toAdd=document.getElementById(dragId).querySelector("#cost").innerHTML;
   let totalprice=parseFloat(originaldata)+parseFloat(toAdd);

   let originalQuantity=parseInt(document.getElementById(dropId).querySelector("#quantity").innerHTML)+1;
   
   document.getElementById(dropId).querySelector("#total").innerHTML=totalprice.toFixed(2);
   document.getElementById(dropId).querySelector("#quantity").innerHTML=originalQuantity;

   if(dropId=="table1")
   table1.push(dragId);
   else if(dropId=="table2")
   table2.push(dragId);
   else
    table3.push(dragId);
}

function searchTables()
{
    let input,filter,ul,li,i,p,tablename;
    input=document.getElementById("tableSearch");
    filter=input.value.toLocaleLowerCase();
    ul=document.getElementById("mytables");
    li=ul.getElementsByTagName("li");

    for(i=0;i<li.length;i++)
    {
        p=li[i].getElementsByTagName("a")[0];
        tablename=p.innerHTMl || p.textContent;
        if(tablename.toLocaleLowerCase().indexOf(filter)>-1)
        {
            li[i].style.display="";
        }
        else
        { 
            li[i].style.display="none";

        }
    }
}
function searchItems()
{
    let input,filter,ul,li,i,p,dishname,coursename;
    input=document.getElementById("itemSearch");
    filter=input.value.toLocaleLowerCase();
    ul=document.getElementById("myitems");
    li=ul.getElementsByTagName("li");

    for(i=0;i<li.length;i++)
    {
        p=li[i].getElementsByTagName("h3")[0];
        dishname=p.innerHTMl || p.textContent;
        c=li[i].getElementsByTagName("p")[1];
        coursename=c.innerHTMl || c.textContent;
        if(dishname.toLocaleLowerCase().indexOf(filter)>-1 || coursename.toLocaleLowerCase().indexOf(filter)>-1)
        {
            li[i].style.display="";
        }
        else
        { 
            li[i].style.display="none";

        }
    }
}

function listItems(id)
{


   //calculating rows already present in the table
   let table = document.getElementById("popup");
   let rowCount = table.rows.length;
   //taking appropriate list based on id passed
   let tableid=[];
   if(id=='table1')
       tableid=table1;
   else if(id=='table2')
       tableid=table2;
   else if(id=='table3')
       tableid=table3;
   
   //delete already displayed rows
   for (let k = rowCount - 1; k> 1; k--) {
       table.deleteRow(k);
   }
   let set=new Set();
   let cost=0;
   document.getElementById("ModalTableID").innerHTML=id;
  
   for(let itemid of tableid)
   {
       cost=cost+parseFloat(document.getElementById(itemid).querySelector("#cost").innerHTML);
       if(set.has(itemid))
       {
           continue;  //to avoid duplications
       }

    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);  //insert a row at the end
    document.getElementById("itemHiddenID").innerHTML=itemid;


    console.log("item id set "+itemid);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5=row.insertCell(4);
       cell1.innerHTML=rowCount-1;
       cell2.innerHTML=document.getElementById(itemid).querySelector("#name").innerHTML;        
       cell3.innerHTML=document.getElementById(itemid).querySelector("#cost").innerHTML;
       let q=getFreq(tableid,itemid);
       console.log("freq :"+q);
       
      let quant=document.createElement('input');
      quant.setAttribute("style","border:0;outline:0;border-bottom: 2px solid blue");
      quant.setAttribute("type","number");
      quant.setAttribute("min","1");
      quant.setAttribute("max","100");
      quant.setAttribute("value",q);
      let quantID="quantityID"+"-"+id+"-"+itemid;
      quant.setAttribute("id",quantID);
      quant.addEventListener("change",(event)=>
      {
          let targetElement=event.target;
          let tableID=event.target.id.split("-")[1];
          let itemID=event.target.id.split("-")[2];
          let newQuantity=document.getElementById(targetElement.id).value;

          console.log("from quantity event "+tableID+" "+itemID+" "+newQuantity);

          updateQuantity(tableID,itemID,newQuantity);
      })
      cell4.appendChild(quant);


      let delicon=document.createElement('i');
      delicon.setAttribute("class","material-icons");
      delicon.setAttribute("type","button");
      delicon.innerHTML="delete";
      let idForDelete="deleteicon"+"-"+itemid+"-"+id;  //oth element is deleteicon...1st element is itemid...2 nd element is tableid
      //console.log("id for delete for itemid "+itemid+" is "+idForDelete+" and tableid is "+id);
      delicon.setAttribute("id",idForDelete);
      delicon.addEventListener("click",(event)=>{
          
          let itemID=event.target.id.split("-")[1];
          let tableID=event.target.id.split("-")[2];
          deleteItem(tableID,itemID);
      })
      cell5.appendChild(delicon);




       set.add(itemid);
   }
   console.log(cost.toFixed(2));
   document.getElementById("total-bill").innerHTML=cost.toFixed(2);
   document.getElementById(id).querySelector("#total").innerHTML=cost.toFixed(2);

}

function getFreq(arr,value)
{
    let count=0;
    for(let val of arr)
    {
        if(val==value)
           count++;
    }
    return count;
}
function deleteItem(tableid,item)
{
   console.log("delete clicked "+tableid+"-"+item);
   if(tableid=='table1')
   {
       let modifiedcost=getTotalPriceAfterDeleting(table1,item);
       table1=deleteItemIndex(table1,item);
       document.getElementById('table1').querySelector("#total").innerHTML=modifiedcost;
       var originalQuantity=document.getElementById('table1').querySelector("#quantity").innerHTML;
       document.getElementById('table1').querySelector("#quantity").innerHTML=originalQuantity-1
       listItems('table1');
   }
   else if(tableid=='table2')
   {
       let modifiedcost=getTotalPriceAfterDeleting(table2,item);
       table2=deleteItemIndex(table2,item);
       document.getElementById('table2').querySelector("#total").innerHTML=modifiedcost;
       var originalQuantity=document.getElementById('table2').querySelector("#quantity").innerHTML;
       document.getElementById('table2').querySelector("#quantity").innerHTML=originalQuantity-1
       listItems('table2');
   }
   else if(tableid=='table3')
   {
       let modifiedcost=getTotalPriceAfterDeleting(table3,item);
       table3=deleteItemIndex(table3,item);
       document.getElementById('table3').querySelector("#total").innerHTML=modifiedcost;
       var originalQuantity=document.getElementById('table3').querySelector("#quantity").innerHTML;
       document.getElementById('table3').querySelector("#quantity").innerHTML=originalQuantity-1
       listItems('table3');
   }
    
}

function getTotalPriceAfterDeleting(arr,item)
{
       let f=getFreq(arr,item);
       let itemprice=document.getElementById(item).querySelector("#cost").innerHTML;
       let originalcost=document.getElementById("total-bill").innerHTML;
       let modifiedcost=originalcost-f*itemprice;

       return modifiedcost;
}
function deleteItemIndex(arr,item)
{
    arr=arr.filter(function(x){
        return x!=item;
    });
    return arr;
}
function generatebill()
{
    $("#myModal").modal('hide');
    let totalbill= document.getElementById("total-bill").innerHTML;
    document.getElementById("totalbillcost").innerHTML=totalbill;
}
function emptyTable()
{
    console.log("empty table called");
    let tableidToClear=document.getElementById("ModalTableID").innerHTML;
    document.getElementById(tableidToClear).querySelector("#total").innerHTML="0.00";
    document.getElementById(tableidToClear).querySelector("#quantity").innerHTML=0;
    if(tableidToClear=='table1')
    {
        table1.length=0;
    }
    else if(tableidToClear=='table2')
    {
        table2.length=0;
    }
    else if(tableidToClear=='table3')
    {
        table3.length=0;
    }
}

function updateQuantity(tableid,itemid,newquantity)
{
      console.log("parameters called:"+tableid+" "+itemid+" "+newquantity);
      let index=0;
       if(tableid=='table1')
       {
         index=table1.indexOf(itemid);  
        table1= deleteItemIndex(table1,itemid);  
       }
       else if(tableid=='table2')
       {
         index=table2.indexOf(itemid);   
        table2=deleteItemIndex(table2,itemid);
       }
       else if(tableid=='table3')
       {         
           index=table3.indexOf(itemid);   
         table3= deleteItemIndex(table3,itemid);
       }
       
     console.log("freq after deleting :"+getFreq(tableid,itemid));  
   for(let a=0;a<newquantity;a++)
   {
        if(tableid=='table1')
        {
           table1.splice(index,0,itemid);
        }
       else if(tableid=='table2')
       {
           table2.splice(index,0,itemid);
       }
       else if(tableid=='table3')
       {
           table3.splice(index,0,itemid);
       }
   }
   console.log("freq after pushing :"+getFreq(table1,itemid));  

   listItems(tableid);
}