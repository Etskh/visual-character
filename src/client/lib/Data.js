
export const createData = (name, transformer) => {
  const fields = [];
  let defaultTransformer = transformer;
  return {
    // constant functions
    getName: () => {
      return name;
    },
    getFields: () => {
      return fields;
    },
    getTotal: (ctx) => {
      const total = fields.reduce((acc,cur) => {
        return acc + cur.valueGetter();
      }, 0);

      if( defaultTransformer ) {
        return defaultTransformer(total);
      }
      return total;
    },
    //
    //
    addBaseValue: (val) => {
      fields.push({
        name: 'base',
        valueGetter: () => ( val ),
      });
    },
    addValue: (name, val) => {
      fields.push({
        name,
        valueGetter: () => ( val ),
      });
    },
    addChoice: (name, value, choice) => {
      fields.push({
        name,
        sourceType: 'choice',
        source: choice,
        valueGetter: () => ( value ),
      });
    },
    addItem: (item) => {
      fields.push({
        name: item.name,
        sourceType: 'item',
        source: item,
        valueGetter: () => ( item.itemType.data[name] ),
      });
    },
    addEffect: (effect) => {
      fields.push({
        name: effect.name,
        sourceType: 'effect',
        source: effect,
        valueGetter: () => ( effect.data[name] ),
      });
    },
    addData: (data) => {
      fields.push({
        name: data.getName(),
        sourceType: 'data',
        source: data,
        valueGetter: data.getTotal,
        //valueGetter: () => {
        //  console.log(`Getting ${data.getName()}(${data.getTotal()}) for ${name}`);
        //  return data.getTotal();
        //},
      });
    },
    setTransformer: (t) => {
      defaultTransformer = t;
    },
  }
};
