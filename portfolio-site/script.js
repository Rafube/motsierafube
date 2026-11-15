(function(){
  /* Requirements traceability matrix */
  var D={O:"Business Overview",B:"Branch Performance",S:"Salespersons",P:"Products",A:"All dashboards"};
  var R=[
  ["Display Total Revenue","CEO","High","O"],["Display Total Profit","CFO","High","O"],["Display Total Cost","CFO","High","O"],["Display Profit Margin %","CFO","High","O"],
  ["Display Total Units Sold","Sales Director","High","O"],["Display Monthly Revenue Trends","CEO","High","O"],["Display Monthly Profit Trends","CFO","High","O"],["Display Monthly Units Sold Trends","Sales Director","Medium","O"],
  ["Display Revenue by Salesperson","Sales Director","High","O"],["Display Revenue by Manager","Operations Manager","High","O"],["Display Revenue by Product","Sales Director","High","O"],["Display Product Profit Margin %","CFO","High","O"],
  ["Display Revenue by Branch","Operations Manager","High","B"],["Display Profit by Branch","CFO","High","B"],["Display Cost by Branch","CFO","Medium","B"],["Display Units Sold by Branch","Operations Manager","Medium","B"],
  ["Display Branch Revenue Contribution","Operations Manager","Medium","B"],["Display Branch Ranking","CEO","High","B"],
  ["Display Revenue by Salesperson","Sales Director","High","S"],["Display Salesperson Ranking","Sales Director","High","S"],["Display Revenue Contribution %","Sales Director","Medium","S"],["Display Revenue by Manager","Operations Manager","Medium","S"],["Display Units Sold by Salesperson","Sales Director","Medium","S"],
  ["Display Product Revenue","Sales Director","High","P"],["Display Product Profit","CFO","High","P"],["Display Product Cost","CFO","Medium","P"],["Display Product Profit Margin %","CFO","High","P"],["Display Product Units Sold","Sales Director","Medium","P"],
  ["Branch filter capability","All stakeholders","High","A"],["Product category filter capability","All stakeholders","High","A"],["Product filter capability","All stakeholders","High","A"],["Date filter capability","All stakeholders","High","A"]];
  function pad(n){return (n<10?"00":"0")+n}
  var ctl=document.getElementById("rtmctl"),body=document.querySelector("#rtm tbody"),note=document.getElementById("rtmnote");
  var cur="ALL";
  function draw(){
    var rows=[],hi=0;
    R.forEach(function(r,i){ if(cur==="ALL"||r[3]===cur){ if(r[2]==="High")hi++;
      rows.push("<tr><td class=\"id\">FR"+pad(i+1)+"</td><td>"+r[0]+"</td><td>"+r[1]+"</td><td class=\"pr "+r[2]+"\">"+r[2]+"</td><td>"+D[r[3]]+"</td><td class=\"tc\">TC"+pad(i+1)+"</td></tr>");}});
    body.innerHTML=rows.join("");
    note.textContent=rows.length+" requirements shown, "+hi+" high priority. Every row has a stakeholder, a dashboard and a test case.";
  }
  [["ALL","All 32"],["O","Business overview"],["B","Branch"],["S","Salespersons"],["P","Products"],["A","Filters"]].forEach(function(f){
    var b=document.createElement("button");b.textContent=f[1];b.setAttribute("aria-pressed",f[0]==="ALL");
    b.addEventListener("click",function(){cur=f[0];ctl.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",x===b)});draw()});
    ctl.appendChild(b);});
  draw();

  /* Star schema */
  var NS="http://www.w3.org/2000/svg",svg=document.getElementById("star");
  function el(n,a,t){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(t!=null)e.textContent=t;svg.appendChild(e);return e}
  function table(x,y,w,title,rows,fact){
    var h=32+rows.length*23+8;
    el("rect",{x:x,y:y,width:w,height:h,rx:8,class:"t-b"});
    el("path",{d:"M"+x+" "+(y+32)+"V"+(y+8)+"Q"+x+" "+y+" "+(x+8)+" "+y+"H"+(x+w-8)+"Q"+(x+w)+" "+y+" "+(x+w)+" "+(y+8)+"V"+(y+32)+"Z",class:fact?"t-hf":"t-h"});
    el("text",{x:x+14,y:y+21,class:"t-t"},title);
    rows.forEach(function(r,i){var ry=y+32+14+i*23;
      el("text",{x:x+14,y:ry+4,class:"t-r"},r[0]);
      if(r[1])el("text",{x:x+w-12,y:ry+4,class:"t-k","text-anchor":"end"},r[1]);});
    return h;
  }
  /* lines first so tables sit on top */
  el("line",{x1:480,y1:134,x2:480,y2:196,class:"ln"});
  el("line",{x1:480,y1:392,x2:480,y2:448,class:"ln"});
  el("line",{x1:290,y1:285,x2:340,y2:285,class:"ln"});
  el("line",{x1:680,y1:285,x2:620,y2:285,class:"ln"});
  table(340,8,280,"Dim_Date",[["Date","PK"],["Month",""],["Quarter",""],["Year",""]]);
  table(340,196,280,"Fact_Sales",[["Date","FK"],["BranchID","FK"],["ProductID","FK"],["SalespersonID","FK"],["Revenue",""],["Cost",""],["Units Sold",""]],true);
  table(10,222,280,"Dim_Branch",[["BranchID","PK"],["BranchName",""],["Province",""],["Manager",""]]);
  table(680,236,270,"Dim_Product",[["ProductID","PK"],["Product",""],["Category",""]]);
  table(330,448,300,"Dim_Salesperson",[["SalespersonID","PK"],["SalespersonName",""],["Position",""],["BranchID",""],["HireDate",""]]);
  el("text",{x:490,y:150,class:"cd"},"1");el("text",{x:490,y:188,class:"cd"},"*");
  el("text",{x:490,y:404,class:"cd"},"*");el("text",{x:490,y:442,class:"cd"},"1");
  el("text",{x:296,y:276,class:"cd"},"1");el("text",{x:326,y:276,class:"cd"},"*");
  el("text",{x:664,y:276,class:"cd"},"1");el("text",{x:626,y:276,class:"cd"},"*");

  /* Dashboard tabs */
  var S=[
   ["overview","Business Performance Overview","Revenue, cost, profit and margin with monthly trends, plus revenue by salesperson, manager and product. Covers FR001 to FR012.",["Total revenue","Total cost","Total profit","Profit margin %","Units sold","Monthly revenue trend","Monthly profit trend","Monthly units trend","Revenue by product"]],
   ["branch","Branch Performance","Profit, revenue, cost and units sold by branch, with a branch performance table. Covers FR013 to FR018. This capture is filtered to Laptops, January to March 2025.",["Revenue by branch","Profit by branch","Cost by branch","Units by branch","Revenue contribution","Branch ranking"]],
   ["salespersons","Salespersons Performance","Ranking, revenue contribution, units sold and revenue by manager for the eight salespersons. Covers FR019 to FR023.",["Revenue by salesperson","Salesperson ranking","Revenue contribution %","Revenue by manager","Units by salesperson"]],
   ["products","Products","Revenue, cost, profit, margin and units for each of the six products, with a performance table. Covers FR024 to FR028.",["Product revenue","Product cost","Product profit","Profit margin %","Units sold","Performance table"]]];
  var tabs=document.querySelectorAll(".tabs button"),img=document.getElementById("shotimg"),cap=document.getElementById("shotcap"),chips=document.getElementById("shotchips"),panel=document.getElementById("shot");
  function show(i){
    tabs.forEach(function(t,j){t.setAttribute("aria-selected",j===i)});
    img.src="img/"+S[i][0]+".jpg";img.alt=S[i][1]+" dashboard";cap.textContent=S[i][2];
    chips.innerHTML=S[i][3].map(function(c){return "<span>"+c+"</span>"}).join("");
    panel.setAttribute("aria-labelledby","t"+i);
  }
  tabs.forEach(function(t,i){t.addEventListener("click",function(){show(i)})});
  show(0);

  /* Copy */
  document.querySelectorAll(".copy").forEach(function(b){
    b.addEventListener("click",function(){
      var row=b.parentNode.querySelector(".v");
      function sel(){var r=document.createRange();r.selectNodeContents(row);var s=getSelection();s.removeAllRanges();s.addRange(r)}
      function ok(){b.textContent="Copied";setTimeout(function(){b.textContent="Copy"},1500)}
      try{navigator.clipboard.writeText(b.getAttribute("data-copy")).then(ok,sel)}catch(e){sel()}
    });
  });
})();

(function(){
  var views={home:document.getElementById("v-home"),project:document.getElementById("v-project"),experience:document.getElementById("v-cv")};
  var links=document.querySelectorAll("[data-route]");
  function route(first){
    var h=(location.hash||"").slice(1);
    if(h==="contact")return;
    if(!views[h])h="home";
    for(var k in views)views[k].hidden=(k!==h);
    links.forEach(function(a){if(a.getAttribute("data-route")===h)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
    if(!first)window.scrollTo(0,0);
  }
  window.addEventListener("hashchange",function(){route(false)});
  route(true);
  document.querySelectorAll("[data-go]").forEach(function(b){b.addEventListener("click",function(){
    var t=document.getElementById(b.getAttribute("data-go"));if(t)t.scrollIntoView({behavior:"smooth",block:"start"});});});
})();

/* Resume download: inside the hosted viewer, save through the downloads capability; elsewhere the link simply opens the PDF. */
(function(){
  var links=document.querySelectorAll("[data-resume]");
  links.forEach(function(a){
    a.addEventListener("click",async function(e){
      if(!(window.claude&&window.claude.use))return;
      e.preventDefault();
      var href=a.getAttribute("href");
      try{
        var d=await window.claude.use("downloads");
        if(!d){window.open(href,"_blank");return}
        var r=await fetch(href);var blob=await r.blob();
        await d.save({filename:"Motsie_Barend_Rafube_Resume.pdf",data:blob});
      }catch(err){ if(!err||err.code!=="declined"){try{window.open(href,"_blank")}catch(x){}} }
    });
  });
})();
