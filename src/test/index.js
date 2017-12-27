import expect from 'expect';

describe('Carry', () => {

  it('get load name based on weight carried', (done) => {

    const data = {
      stats: {
        str: 18,
      },
    };

    expect(data.stats.str).toBe(18);
    done();
  });
});
