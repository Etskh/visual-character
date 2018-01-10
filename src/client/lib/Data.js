
// eslint-disable-next-line import/prefer-default-export
export const createData = (name, transformer) => {
  const fields = [];
  let defaultTransformer = transformer;
  return {
    // constant functions
    getName: () => name,
    getFields: () => fields,
    getTotal: () => {
      const total = fields.reduce((acc, cur) => acc + cur.valueGetter(), 0);

      if (defaultTransformer) {
        return defaultTransformer(total);
      }
      return total;
    },
    //
    //
    addBaseValue: (val) => {
      fields.push({
        name: 'base',
        valueGetter: () => (val),
      });
    },
    addValue: (valueName, val) => {
      fields.push({
        name: valueName,
        valueGetter: () => (val),
      });
    },
    addChoice: (choiceName, value, choice) => {
      fields.push({
        name: choiceName,
        sourceType: 'choice',
        source: choice,
        valueGetter: () => (value),
      });
    },
    addItem: (item) => {
      fields.push({
        name: item.name,
        sourceType: 'item',
        source: item,
        valueGetter: () => (item.itemType.data[name]),
      });
    },
    addEffect: (effect) => {
      fields.push({
        name: effect.name,
        sourceType: 'effect',
        source: effect,
        valueGetter: () => (effect.data[name]),
      });
    },
    addData: (data) => {
      fields.push({
        name: data.getName(),
        sourceType: 'data',
        source: data,
        valueGetter: data.getTotal,
        // valueGetter: () => {
        //  console.log(`Getting ${data.getName()}(${data.getTotal()}) for ${name}`);
        //  return data.getTotal();
        // },
      });
    },
    setTransformer: (t) => {
      defaultTransformer = t;
    },
  };
};
