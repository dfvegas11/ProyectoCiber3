import React from 'react';
import './css/KMap.css';
import './css/drawGroup.css';
import $ from 'jquery';
import Map from './Map.js';
import TruthTable from './truthTable.js';
import OptionButton from './optionButton.js';

export default class KarnaughMap extends React.Component {
    constructor(props) {
      super(props);
  
      let t = 4;
      let a = this.getMatrixSquare(t);
      let p = this.getMatrixPerm(t);
      let m = this.setCoord(a, p, t);
      let s = "SOP";
      this.state = {
        squares: m,  
        typeMap: t,
        perm: p,     
        typeSol: s   
      };
    }
  
    getMatrixPerm(dim) {
      let col = dim;
      let row = Math.pow(2, dim); 
      let a = [];                 
      for (let i = 0; i < row; i++) { 
        let temp = [];
        for (let j = 0; j < col; j++)
          temp[j] = 0;
        a[i] = temp;
      }
  
      for (let j = 0; j < col; j++) {      
        let count = (Math.pow(2, dim)) / 2; 
  
        for (let i = 0; i < row; i++) {     
          let val = (i % (count * 2) < count) ? 0 : 1;  
          a[i][j] = "" + val;                        
        }
        dim--;       
      }
      return a;
    }
  
    getMatrixSquare(dim) {      
      let row = dim;
      let col = dim;
      let deep = 2;         
      if (dim === 3) {
        row = 2;
        col = 4;
      }
  
      let a = [];
      for (let i = 0; i < row; i++) {
        let temp = [];
        for (let j = 0; j < col; j++) {
          let t = [];
          for (let k = 0; k < deep; k++)
            t[k] = 0;
          temp[j] = t;
        }
        a[i] = temp;
      }
      return a;
    }
  
    reset(){
      const typeMap = this.state.typeMap;
      let r = typeMap;
      let c = typeMap;
      if (typeMap === 3) {
        r = 2;
        c = 4;
      }
      $("#elabora").prop("disabled", false); 
  
      for (let i = 0; i < r; i++) 
        for (let j = 0; j < c; j++) {
          $("#" + i + j).removeClass();
          $("#" + i + j).html("");
          for (let k = 0; k < 10; k++)
            $("#" + i + j + k).remove();          
        }
      
        $("#sol").html("");
        $("#costo").html("");
        $(".Solution").hide();
        $(".Solution").css("left","720px");
    }
  
    setCoord(squares, perm, typeMap) {
      let r = typeMap;
      let c = typeMap;
      if (typeMap === 3) {  
        c = 4;
        r = 2;
      }
      for (let i = 0; i < c; i++) { 
        let l;
        if (i === 2) l = 3; 
        else if (i === 3) l = 2;
        else l = i;
  
        for (let j = 0; j < r; j++) {
          let k;
          if (j % r === 2) k = 3; 
          else if (j % r === 3) k = 2;
          else k = j;
          let val = "";
          let t = typeMap;
  
          let p = 0;
          do {
            val += perm[i * r + j][p];
            p++;
          } while (p < t / 2);
          squares[k][l][1] = val;
          val = "";
          p = Math.floor(t / 2);
          if (typeMap === 3) {  
            t = 2;
            p = Math.floor(t / 2 + 1);
          }
          do {
            val += perm[i * r + j][p];
            p++;
          } while (p < t);
          squares[k][l][2] = val;
        }
      }
      return squares;
    }
  
    setTypeMap(val) {             
      let a = this.getMatrixSquare(val);
      let b = this.getMatrixPerm(val);
      let c = this.setCoord(a, b, val);
      this.reset();
      this.setState({
        typeMap: val,
        squares: c,
        perm: b,
      });
    }
  
    handleClick(i, j) { 
      const squares = this.state.squares;
      if (squares[i][j][0] === 0)
        squares[i][j][0] = 1;
      else
        squares[i][j][0] = 0;

      this.reset();
      this.setState({ 
        squares: squares,
      });
    }
  
    
    Algorithm(squares) {
  
      $("#elabora").prop("disabled", true);
      var dimCol, dimRig;
      const typeSol = this.state.typeSol;
      let val = (typeSol === "SOP")? 1 : 0 ;
  
      if (this.state.typeMap === 4) {
        dimCol = 4;
        dimRig = 4;
      }
      else
        if (this.state.typeMap === 3) {
          dimCol = 4;
          dimRig = 2;
        }
        else {
          dimCol = 2;
          dimRig = 2;
        }
  
      var groups = new Array(dimRig);
  
      for (let i = 0; i < dimRig; i++) {
        groups[i] = new Array(dimCol);
  
        for (let j = 0; j < dimCol; j++)
          groups[i][j] = []; 
      }
  
      var index = 0; 
      for (let i = 0; i < dimRig; i++) {
        for (let j = 0; j < dimCol; j++) {
  
          var count = 0;
  
          if (squares[i][j][0] === val) { 
            var TempI = i;
            var TempJ = j;
  
            if (j === dimCol - 1)
            {
              let ok = true;
              let count2 = 0;
  
              for (let altezza = i; altezza < dimRig && ok; altezza++)
                if (squares[altezza][dimCol - 1][0] === val && squares[altezza][0][0] === val) {
                  groups[altezza][0].push(index);
                  groups[altezza][dimCol - 1].push(index);
                  count2++;
                }
                else
                  ok = false;
  
              if (count2 > 0) {
                index++;
  
                if (!isPower(2, count2)) {
                  groups[i + count2 - 1][0].pop();
                  groups[i + count2 - 1][dimCol - 1].pop();
                } 
              }
  
            }
  
            if (i === dimRig - 1)
            {
              let ok = true;
              let count2 = 0;
  
              for (let colonna = j; colonna < dimCol && ok; colonna++)
                if (squares[dimRig - 1][colonna][0] === val && squares[0][colonna][0] === val) {
                  groups[dimRig - 1][colonna].push(index);
                  groups[0][colonna].push(index);
                  count2++;
                }
                else
                  ok = false;
  
              if (count2 > 0) {
                index++;
  
                if (!isPower(2, count2)) {
                  groups[dimRig - 1][j + count2 - 1].pop();
                  groups[0][j + count2 - 1].pop();
                }
              }
  
            }
  
            do { 
              groups[TempI][TempJ].push(index); 
              count++;
              TempJ++;
            } while (TempJ < dimCol && squares[TempI][TempJ][0] === val);
  
            if (!isPower(2, count)) 
            {
              groups[TempI][TempJ - 1].pop(); 
              count--;
            }
  
            var CountVer;
            var depth = 100; 
            var isOk = true; 
            for (let spostamento = 0; spostamento < count; spostamento++) { 
              TempI = i + 1;
              TempJ = j + spostamento;
              CountVer = 1;
  
              while (TempI < dimRig && CountVer < depth) {
                if (squares[TempI][TempJ][0] !== val) {
                  if (spostamento !== 0 && CountVer !== depth) {
  
                    var rig = TempI;
                    if (!isPower(2, spostamento))
                    {
  
                      if (!isPower(2, CountVer)) 
                        rig--;
  
                      groups[TempI][TempJ].push(index);
  
                      if (TempI >= depth)
                        depth = TempI;
                      else
                        depth--;
  
                      for (; rig <= depth; rig++)
                        for (let col = TempJ - 1; col <= spostamento; col++)
                          groups[rig][col].pop();
  
                      isOk = false;
                    }
                  }
                  break;
                }
                groups[TempI][TempJ].push(index);
                TempI++;
                CountVer++;
              }
  
              if (CountVer < depth)
                depth = CountVer;
  
              if (!isPower(2, CountVer) && isOk) { 
                groups[TempI - 1][TempJ].pop();
                depth--;
              }
            }
            index++;
          }
        }
  
      }
      this.GroupUp(squares, $.extend(true, [], groups));
    }
  
    GroupUp(squares, values) {
      var groups = [];
  
      var group1 = [];
      var group2 = [];
      var obj1, obj2;
      var dimCol, dimRig;
      const typeSol = this.state.typeSol;
      let val = (typeSol === "SOP")? 1 : 0 ;
  
      if (this.state.typeMap === 4) {
        dimCol = 4;
        dimRig = 4;
      }
      else
        if (this.state.typeMap === 3) {
          dimCol = 4;
          dimRig = 2;
        }
        else {
          dimCol = 2;
          dimRig = 2;
        }
  
      if(squares[0][0][0]===val && squares[0][dimCol-1][0]===val && squares[dimRig-1][0][0]===val && squares[dimRig-1][dimCol-1][0]===val)
      {
  
        obj1 = {
          riga: 0,
          col: 0
        };
  
        group1.push(obj1);
        
        obj1 = {
          riga: 0,
          col: dimCol-1
        };
  
        group1.push(obj1);
        
        obj1 = {
          riga: dimRig-1,
          col: 0
        };
  
        group1.push(obj1);
  
        obj1 = {
          riga: dimRig-1,
          col: dimCol-1
        };
  
        group1.push(obj1);
  
        groups.push(group1);
  
        group1=[];
       
      }
  
      for (let i = 0; i < dimRig; i++) {
        for (let j = 0; j < dimCol; j++) {
  
          if (squares[i][j][0] === val) { 
  
            var index = values[i][j][0];
            var InizioRiga = i;
            var InizioCol = j;
  
            if (j === dimCol - 1) {
              while (InizioRiga < dimRig && values[InizioRiga][j][0] === index && values[InizioRiga][0][0] === index) {
  
                obj1 = {
                  riga: InizioRiga,
                  col: 0
                };
  
                obj2 = {
                  riga: InizioRiga,
                  col: j
                };
  
                values[InizioRiga][j].shift();
                values[InizioRiga][0].shift();
  
                group1.push(obj1);
                group1.push(obj2);
  
                InizioRiga++;
              }
  
              if (group1.length > 0) {
                groups.push(group1);
                group1 = [];
                index = values[i][j][0];
              }
  
  
              InizioRiga = i;
              InizioCol = j;
  
            }
  
            if (i === dimRig - 1) {
              while (InizioCol < dimCol && values[i][InizioCol][0] === index && values[0][InizioCol][0] === index) {
  
                obj1 = {
                  riga: i,
                  col: InizioCol
                };
  
                obj2 = {
                  riga: 0,
                  col: InizioCol
                };
  
                values[0][InizioCol].shift();
                values[i][InizioCol].shift();
  
                group1.push(obj1);
                group1.push(obj2);
  
                InizioCol++;
              }
  
              if (group1.length > 0) {
                group1.sort(function (a, b) { return a.riga - b.riga });
                groups.push(group1);
                group1 = [];
                index = values[i][j][0];
              }
  
  
              InizioRiga = i;
              InizioCol = j;
            }
  
            while (InizioCol < dimCol && values[InizioRiga][InizioCol][0] === index)
              InizioCol++;
  
            while (InizioRiga < dimRig && values[InizioRiga][InizioCol - 1][0] === index)
              InizioRiga++;
  
  
            for (let FineRiga = i; FineRiga < InizioRiga; FineRiga++)
              for (let FineCol = j; FineCol < InizioCol; FineCol++) {
                obj1 = {
                  riga: FineRiga,
                  col: FineCol
                };
                group1.push(obj1);
              }
  
            groups.push(group1);
  
            InizioRiga = i;
            InizioCol = j;
  
            while (InizioRiga < dimRig && values[InizioRiga][InizioCol][0] === index)
              InizioRiga++;
  
            while (InizioCol < dimCol && values[InizioRiga - 1][InizioCol][0] === index)
              InizioCol++;
  
            for (let FineRiga = i; FineRiga < InizioRiga; FineRiga++)
              for (let FineCol = j; FineCol < InizioCol; FineCol++) {
                obj1 = {
                  riga: FineRiga,
                  col: FineCol
                };
                group2.push(obj1);
              }
  
            var equal = true;
            if (group1.length === group2.length)
            {
              for (let v = 0; v < group1.length && equal; v++)
                if (group1[v].riga !== group2[v].riga && group1[v].col !== group2[v].col)
                  equal = false;
            }
                  else
                  groups.push(group2);
  
            if (!equal)
             groups.push(group2);
  
            group1 = [];
            group2 = [];
  
            for (let k = 0; k < dimRig; k++)
              for (let z = 0; z < dimCol; z++)
                if (values[k][z][0] === index)
                  values[k][z].shift();
  
          }
  
        }
      }
      this.CleanAlgorithm($.extend(true, [], groups));
    }
    
    CleanAlgorithm(groups) {
      groups.sort(function (a, b) { return a.length - b.length });
      groups.reverse(); 
  
       var temp = $.extend(true, [], groups);
       
       for(let i=0; i<temp.length; i++){           
        for(let j=i+1; j<temp.length; j++){     
  
          if(temp[i].length<temp[j].length){     
            let p=i;                               
            while(temp[p].length<temp[p+1].length){  
              let t = temp[p];                       
              temp[p]=temp[p+1];                     
              temp[p+1]=t;
  
              t = groups[p];                        
              groups[p]=groups[p+1];
              groups[p+1]=t;
            }
          }
  
          for(let k=0; k<temp[i].length; k++){        
            for(let l=0; l<temp[j].length; l++)        
              if((temp[i][k].riga===temp[j][l].riga) && (temp[i][k].col===temp[j][l].col)){    
                for(let p=l;p<temp[j].length-1;p++) temp[j][p] = temp[j][p+1];                  
                delete temp[j][temp[j].length-1];       
                temp[j].length--;                                               
              }     
          }   
        }
      }
  
        var trovato,eliminato,obj1,value;
    for (let v = 0; v < groups.length; v++) 
    {
        eliminato = true;
      if (temp[v].length>0)
        for (let index = 0; index < groups[v].length && eliminato; index++) 
        {
          obj1 = groups[v][index];
          trovato = false;
          for (let k = 0; k < groups.length && !trovato; k++)
          {
  
            if (v !== k && temp[k].length>0) 
            {
              value = groups[k].findIndex((obj2) => obj1.riga === obj2.riga && obj1.col === obj2.col); 
              if (value !== -1) 
                trovato = true;
            }
          }
  
            if(trovato===false)
             eliminato=false;
        }
  
        if(eliminato===true)
         temp[v]=[];
  
      }
      this.Solution(temp, groups);
      this.drawGroup(temp, groups);
    }
  
    Solution(temp, groups) {                        
      const matrice = this.state.squares;         
      var alp = ["A", "B", "C", "D"];             
      var soluzione="";                             
      var vettoreSol=[];                              
      var k, j, t;
      
      var elementoR, elementoC;                    
      var flag;                                    
      var coord;                                  
      var ner;
      var tipoSol=this.state.typeSol;
      for (let i = 0; i < temp.length; i++) {
  
        if (temp[i].length > 0) {
          k = 0;
          elementoR = groups[i][0].riga;              
          elementoC = groups[i][0].col;
  
          ner = 0;
          while (ner < groups[i].length && groups[i][ner].riga === elementoR)  
          {
            ner++;
          }
  
          
          t = 0;
          coord = matrice[elementoR][elementoC][1];  
          while (t < coord.length) {
            j = 1;
            flag = true;
            while (j < groups[i].length && groups[i][j].riga === elementoR) {       
              if (coord.charAt(t) !== matrice[elementoR][groups[i][j].col][1].charAt(t)) {  
                flag = false;                                               
                break;
              }
              j++;
            }
            if (flag) {                        
              if(tipoSol==="SOP")                
              {
                if (coord.charAt(t) === "0") {
                  soluzione += "'" + alp[k];
                }
                else{
                  soluzione += alp[k];
                }
              }
              else{                               
                if (coord.charAt(t) === "0") {
                  soluzione += alp[k];
                }
                else{
                  soluzione += "'" + alp[k];
                }
                soluzione += "+";
              }
            }
            k++;
            t++;
          }
  
          
          t = 0;
          coord = matrice[elementoR][elementoC][2];    
          while (t < coord.length) {
            j = ner;
            flag = true;
            while (j < groups[i].length && groups[i][j].col === elementoC) {   
              if (coord.charAt(t) !== matrice[groups[i][j].riga][elementoC][2].charAt(t)) { 
                flag = false;                                     
                break;
              }
              j += ner;
            }
            if (flag) {                        
              if(tipoSol==="SOP")                 
              {
                if (coord.charAt(t) === "0") {
                  soluzione +=  "'" + alp[k];
                }
                else{
                  soluzione += alp[k];
                }
              }
              else{                               
                if (coord.charAt(t) === "0") {
                  soluzione += alp[k];
                }
                else{
                  soluzione += "'" + alp[k];
                }
                soluzione += "+";
              }
            }
            k++;
            t++;
          }
          if(tipoSol==="POS")     
          {
            soluzione=soluzione.substr(0,soluzione.length-1);
          }
          vettoreSol.push(soluzione);
          soluzione="";
        }
      }
  
      if (vettoreSol[0] === "" || !vettoreSol[0])   
      {
        
        if (matrice[0][0][0] === 0) {
          vettoreSol[0]="0";
        }
        else {
          vettoreSol[0]="1";
        }
      }
      this.drawSolution(vettoreSol);
    }
  
    drawGroup(temp, groups) {
      let color = ["red", "blue", "green", "orange", "#50C878","lightblue","#CD7F32","#ff6699"];  
      let c = -1; 
      for (let i = 0; i < temp.length; i++) { 
        if (temp[i].length > 0 && groups[i].length !== Math.pow(2, this.state.typeMap)) {
          c++;
          let j = 0;
          let FirstElCol = groups[i][0].col;
          let FirstElRig = groups[i][0].riga;
          while (j < groups[i].length) {                                    
            let element = $("#" + groups[i][j].riga + groups[i][j].col);    

            if (element.attr('class') && $("#" + element.attr('id') + c)) { 
              element.after("<div id=" + element.attr('id') + c + "></div>"); 
              element = $("#" + groups[i][j].riga + groups[i][j].col + c);    
            }
            element.css("border-color", color[c]);                            
            element.append("<div class='backgr' style='background-color: "+color[c]+"'></div>"); 

            
            let destra = this.checkElInGroups(j, groups[i], "destra");
            let sotto = this.checkElInGroups(j, groups[i], "sotto");
            let sinistra = this.checkElInGroups(j, groups[i], "sinistra");
            let sopra = this.checkElInGroups(j, groups[i], "sopra");
  
            
          
            if (destra) {
              if (sotto) {
                if (sinistra) {
                  if (groups[i][j].col === FirstElCol) element.addClass("TopLeft");
                  else if (j === ((groups[i].length / 2) - 1) || j === (groups[i].length - 1)) element.addClass("TopRig");
                  else element.addClass("top")
                }
                else if (sopra) {
                  if (j === groups[i].length - 2 || j === groups[i].length - 1) element.addClass("BotLeft");
                  else if (groups[i][j].riga === FirstElRig) element.addClass("TopLeft");
                  else element.addClass("left");
                }
                else  element.addClass("TopLeft");
              }
              else if (sopra) {
                if (sinistra) {
                  if (groups[i][j].col === FirstElCol) element.addClass("BotLeft");
                  else if (j === groups[i].length - 1 || j === (groups[i].length/2) - 1) element.addClass("BotRig");
                  else element.addClass("bot");
                }
                else element.addClass("BotLeft");
              }
              else if (sinistra) {
                if (j === 0) element.addClass("ClosedLeft")
                else if (j === groups[i].length - 1) element.addClass("ClosedRig");
                else element.addClass("top-bot");
              }
              else element.addClass("ClosedLeft");
            }
  
            else if (sopra) {
              if (sinistra) {
                if (sotto) {
                  if (groups[i][j].riga === FirstElRig) element.addClass("TopRig");
                  else if (j === groups[i].length - 1 || j === groups[i].length - 2) element.addClass("BotRig");
                  else element.addClass("right");
                }
                else element.addClass("BotRig");
              }
              else if (sotto) {
                if (j === 0) element.addClass("ClosedTop");
                else if (j === groups[i].length - 1) element.addClass("ClosedBot");
                else element.addClass("left-right");
              }
              else element.addClass("ClosedBot");
            }
  
            else if (sinistra) {
              if (sotto) element.addClass("TopRig");
              else element.addClass("ClosedRig");
            }
            else if (sotto) element.addClass("ClosedTop");
            else element.addClass("monoGroup");
            j++;
          }
        }
      }
    }
  
    checkElInGroups(j, groups, lato) { 
      const matrix = this.state.squares;
      let r = matrix[0].length;
      let c = matrix[0].length;
      if (this.state.typeMap === 3) {
        r = 2;
        c = 4;
      }
      
      for (let k = 0; k < groups.length; k++) {
        if (lato === "destra" && (groups[k].col === (groups[j].col + 1) % c && groups[k].riga === groups[j].riga % r))
          return true;
        if (lato === "sotto" && (groups[k].col === groups[j].col % c && groups[k].riga === (groups[j].riga + 1) % r))
          return true;
        if (lato === "sinistra") {
          let col = groups[j].col - 1;
          if (col < 0) col = c - 1;
          if ((groups[k].col === col % c && groups[k].riga === groups[j].riga % r))
            return true;
        }
        if (lato === "sopra") {
          let riga = groups[j].riga - 1;
          if (riga < 0) riga = r - 1;
          if ((groups[k].col === groups[j].col % c && groups[k].riga === riga % r))
            return true;
        }
      }
      return false;
    }
  
    drawSolution(vettoreSol){   
      $(".Solution").show();
  
      let costo=0; 
      if(vettoreSol[0]==="0" || vettoreSol[0]==="1"){ 
        $("#sol").append("<div>"+ vettoreSol[0]+ "</div>");
      }
      else{
        const typeSol = this.state.typeSol;
        let s = (typeSol==="SOP")? "+":"·";   
        let cls = (typeSol==="SOP")? "groupSop":"groupPos"; 

        
        let color = ["red", "blue", "green", "orange", "#50C878","lightblue","#CD7F32","#ff6699"];  
  
        for(let i=0; i<vettoreSol.length; i++){ 
          
          $("#sol").append("<div id='sol"+i+"' class='"+cls+"' style='background-color: "+color[i]+"'></div>");
          
          for(let j=0; j<vettoreSol[i].length; j++){ 

            if(vettoreSol[i][j]!=="'")
              $("#sol"+i).append(vettoreSol[i][j]+" "); 
            else{
              
              $("#sol"+i).append("<span style='text-decoration: overline'>"+vettoreSol[i][++j]+"</span> ");
            }
            if(vettoreSol[i][j]!=="+") costo++; 
          }
          if(i!==vettoreSol.length-1) $("#sol").append("<div class='plus'> "+s+" </div>"); 
        }
      }
      $("#costo").html("Literal Cost: "+costo); 

      
      $(".Solution").css("left", parseInt($(".Solution").css("left"))-parseInt($(".Solution").css("width"))/2);
    }
  
    render() {
      
      const values = this.state.squares;
      const typeMap = this.state.typeMap;
      const perm = this.state.perm;
      const typeSol = this.state.typeSol;
      
      let i = 0; 
      return (
        <div key={i++}>
            <div className="title"><h1> Mapa de Karnaugh </h1></div>
          <div className="bodyPage" key={i++}>
          <p className="nameTab"> Tabla de verdad </p>
            <div className="truthTable" key={i++}>
              <TruthTable
                squares={values}
                typeMap={typeMap}
                perm={perm}
                key={i++}
                onClick={(i, j) => this.handleClick(i, j)}
                setRowOrColCell={(i, j, k, val) => this.setRowOrColCell(i, j, k, val)}
              />
            </div>
            <div className="kMap">
              <Map
                squares={values}
                typeMap={typeMap}
                onClick={(i, j) => this.handleClick(i, j)}
              />
            </div>
  
            <OptionButton
              squares={values}
              typeMap={typeMap}
              typeSol={typeSol}
              onClick={() => this.Algorithm(values)}
              setTypeMap={(val) => this.setTypeMap(val)}
            />
            <div className="Solution">
              <div>Función simplificada</div>
              <div className="sol" id="sol">  
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  function isPower(x, y) {
    if (x === 1)
      return (y === 1);
  
    var pow = 1;
    while (pow < y)
      pow *= x;
  
    return (pow === y);
  }