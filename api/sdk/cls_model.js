const tf = require('@tensorflow/tfjs-node');

function normalized(data){
  i = (data[0] - 12.585) / 6.813882
  r = (data[1] - 51.4795) / 29.151289
  v = (data[2] - 650.4795) / 552.6351
  p = (data[3] - 10620.56) / 12152.78
  return [i, r, v, p]
}

const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]).reduce(compareFn)[1]
const argMax = argFact((min, el) => (el[0] > min[0] ? el : min))

function ArgMax(res){
  label = "NORMAL"
  cls_data = []
  for(i=0; i<res.length; i++){
    cls_data[i] = res[i] 
  }
  console.log(cls_data, argMax(cls_data));
  
  if(argMax(cls_data) == 1){
    label = "Over Voltage" 
  }if(argMax(cls_data) == 0){
    label = "Drop Voltage" 
  }
  return label
}

async function classify(data){
  let in_dim = 4;
  
  data = normalized(data);
  shape = [1, in_dim];
  
  tf_data = tf.tensor2d(data, shape);
  
   try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/rindi41420110041/Rindi-JSTM-41420110041/main/public/cls_model/model.json'
        //const path = 'https://raw.githubusercontent.com/zendi014/bot-jst/main/public/ex_model/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return ArgMax( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
  classify: classify 
}
