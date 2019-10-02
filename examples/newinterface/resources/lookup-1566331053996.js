(function(window, undefined) {
  var dictionary = {
    "f58ca0d2-63a7-4c55-a6e6-ac993a128df4": "Screen 1 imported",
    "d12245cc-1680-458d-89dd-4f0d7fb22724": "Screen 1",
    "e73b655d-d3ec-4dcc-a55c-6e0293422bde": "960 grid - 16 columns",
    "995ebcf0-4b7c-4812-a1b2-e77ea1c98863": "Template 1 imported",
    "ef07b413-721c-418e-81b1-33a7ed533245": "960 grid - 12 columns",
    "f39803f7-df02-4169-93eb-7547fb8c961a": "Template 1",
    "a9238e24-9247-497c-8678-b1e8d515a6c4": "Benford",
    "bb8abf58-f55e-472d-af05-a7d1bb0cc014": "default",
    "9f9acef4-6524-4815-b9a9-a086e8b77714": "default imported"
  };

  var uriRE = /^(\/#)?(screens|templates|masters|scenarios)\/(.*)(\.html)?/;
  window.lookUpURL = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, url;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      url = folder + "/" + canvas;
    }
    return url;
  };

  window.lookUpName = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, canvasName;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      canvasName = dictionary[canvas];
    }
    return canvasName;
  };
})(window);