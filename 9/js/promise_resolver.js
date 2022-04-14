var PromiseResolver = class {
    constructor() {
        this.resolve_;
        this.reject_;
        this.isFulfilled_ = false;
        this.promise_ = new Promise((resolve, reject) => {
          this.resolve_ = /** @param {T=} resolution */ (resolution) => {
            resolve(resolution);
            this.isFulfilled_ = true;
          };
          this.reject_ = /** @param {*=} reason */ (reason) => {
            reject(reason);
            this.isFulfilled_ = true;
          };
        });
      }
      get isFulfilled() {
        return this.isFulfilled_;
      }
    
      set isFulfilled(i) {
        assertNotReached();
      }
      get promise() {
        return this.promise_;
      }
    
      set promise(p) {
        assertNotReached();
      }
      get resolve() {
        return this.resolve_;
      }
    
      set resolve(r) {
        assertNotReached();
      }
      get reject() {
        return this.reject_;
      }
    
      set reject(s) {
        assertNotReached();
      }
    };