interface Creep {
  hasFullHealth(): boolean;
};

Creep.prototype.hasFullHealth = function() {
  return this.hits === this.hitsMax;
};
