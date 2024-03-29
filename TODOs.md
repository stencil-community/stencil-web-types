- [ ] _The namespace object contains symbol kind names listed as properties.
Some symbol kinds are predefined and directly supported by IDE (see Direct Support for reference). 
The kind of symbol should relate to its role. For instance a Vue directive should be of the kind vue-directives.
Each framework should define a set of custom symbol kinds if needed.
Reference for the most important symbol kinds defined by frameworks supported by IDEs is below._ - https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#file-structure
- [ ] Review package.json file settings, are we including the bare minimum?
- [ ] CI workflows
- [ ] Is there a better way to express the default slot? "" is a valid name, but looks funky/might not be what folks expect