/**
 * Script Name: Brand Recolor
 * Version: 1.0
 * Author: Lee Whittaker
 * Email: whittakerlee81@gmail.com
 * Date Created: 2024-01-16
 * Last Updated: 2024-01-16
 * Description: A script to recolor a logo file for print and digital use.
 * 
 * Manual preparation:
 * Set up a Print folder and a Digital folder in the same directory as the logo file.
 * Open the logo file in Illustrator.
 * Make sure the logo is the only thing on the artboard.
 * Set up Primary and Secondary layers with the appropriate elements.
 * Import the Pantone, CMYK, and RGB swatches. Remember to "Add to Swatches" after importing.
 * Set the swatch names variables below.
 **/ 

// VARIABLES -------------------------------------------------------------------

// Set Swatch Names
var primaryRGBname = "Tardis RGB";
var secondaryRGBname = "Cool Gray RGB";
var primaryCMYKname = "Tardis CMYK";
var secondaryCMYKname = "Cool Gray CMYK";
var primaryPantonename = "PMS 2955 C";
var secondaryPantonename = "PMS Cool Gray 10 C";

var suffix = ""; // set to -"En" for English, -"Fr" for French, or "" for no suffix

// Set Save Options
var epsSaveOpts = new EPSSaveOptions();
var pdfSaveOpts = new PDFSaveOptions();
var exportJPEG = new ExportOptionsJPEG();
var exportPNG = new ExportOptionsPNG24();
var exportSVG = new ExportOptionsSVG();

// Get Date String
var dateStr = dateStr();

// Get Swatches
var primaryRGB = app.activeDocument.swatches.getByName(primaryRGBname);
var secondaryRGB = app.activeDocument.swatches.getByName(secondaryRGBname);
var primaryCMYK = app.activeDocument.swatches.getByName(primaryCMYKname);
var secondaryCMYK = app.activeDocument.swatches.getByName(secondaryCMYKname);
var primaryPantone = app.activeDocument.swatches.getByName(primaryPantonename);
var secondaryPantone = app.activeDocument.swatches.getByName(secondaryPantonename);

var black = app.activeDocument.swatches.getByName("Black").color;
var white = app.activeDocument.swatches.getByName("White").color;

// AUTOMATION ------------------------------------------------------------------

// Get the current document.
var doc = app.activeDocument;
var docDirectory = doc.path.fsName;
var fileName = doc.name;
var lastUnderscore = fileName.lastIndexOf("_");
if (lastUnderscore !== -1) {
    fileName = fileName.substring(0, lastUnderscore);
}

// Clone the file in CMYK mode.
var newDoc = app.documents.add(DocumentColorSpace.CMYK, doc.width, doc.height);
copyLayers(doc, newDoc);

// doc.close(SaveOptions.DONOTSAVECHANGES); // UNCOMMENT TO CLOSE ORIGINAL FILE
var newFile = new File(docDirectory + "/" + fileName + suffix + "_Color-CMYK-" + dateStr + ".ai");
newDoc.saveAs(newFile);

// Apply the primary and secondary colors to the logo from the provided Pantone `.ase` pallet file.
recolorItems(newDoc.layers.getByName("Primary"), primaryPantone.color);
recolorItems(newDoc.layers.getByName("Secondary"), secondaryPantone.color);

// `Save a Copy` as a `...Pantone.eps` file in the designated `Print` folder.
var pantoneFile = new File(docDirectory + "/Print/" + fileName + "_Pantone" + suffix + ".eps");
newDoc.saveAs(pantoneFile, epsSaveOpts);

// Apply the primary and secondary colors from the provided CMYK `.ase` pallet file.
recolorItems(newDoc.layers.getByName("Primary"), primaryCMYK.color);
recolorItems(newDoc.layers.getByName("Secondary"), secondaryCMYK.color);

// `Save a Copy` as a `...Color.eps` file in the designated `Print` folder.
newDoc.saveAs(new File(docDirectory + "/Print/" + fileName + "_Color" + suffix + ".eps"), epsSaveOpts);

//`Save a Copy` as a `...Color.pdf` file in the designated `Print` folder.
newDoc.saveAs(new File(docDirectory + "/Print/" + fileName + "_Color" + suffix + ".pdf"), pdfSaveOpts);

// Clone the file in RGB mode.
rgbDoc = app.documents.add(DocumentColorSpace.RGB, doc.width, doc.height);
copyLayers(doc, rgbDoc);

var rgbFile = new File(docDirectory + "/" + fileName + suffix + "_Color-RGB-" + dateStr + ".ai");
rgbDoc.saveAs(rgbFile);

// Apply the primary and secondary colors from the provided RGB `.ase` pallet file.
recolorItems(rgbDoc.layers.getByName("Primary"), primaryRGB.color);
recolorItems(rgbDoc.layers.getByName("Secondary"), secondaryRGB.color);

// `Save a Copy` as a `...Color.pdf` file in the designated `Digital` folder.
rgbDoc.saveAs(new File(docDirectory + "/Digital/" + fileName + "_Color" + suffix + ".pdf"), pdfSaveOpts);

// `Export` as a `...Color.jpg` file in the designated `Digital` folder.
var jpgFile = new File(docDirectory + "/Digital/" + fileName + "_Color" + suffix + ".jpg");
rgbDoc.exportFile(jpgFile, ExportType.JPEG, exportJPEG);

// `Export` as a `...Color.png` file in the designated `Digital` folder.
var pngFile = new File(docDirectory + "/Digital/" + fileName + "_Color" + suffix + ".png");
rgbDoc.exportFile(pngFile, ExportType.PNG24, exportPNG);

// `Export` as a `...Color.svg` file in the designated `Digital` folder.
var svgFile = new File(docDirectory + "/Digital/" + fileName + "_Color" + suffix + ".svg");
rgbDoc.exportFile(svgFile, ExportType.SVG, exportSVG);

// Apply `#000000` (black) to primary and secondary logo elements.
recolorItems(rgbDoc.layers.getByName("Primary"), black);
recolorItems(rgbDoc.layers.getByName("Secondary"), black);

// Save a Copy of the .AI file in black.
rgbDoc.saveAs(new File(docDirectory + "/" + fileName + suffix + "_Black-" + dateStr + ".ai"));

// `Save a Copy` as a `...Black.eps` file in the designated `Print` folder.
rgbDoc.saveAs(new File(docDirectory + "/Print/" + fileName + "_Black" + suffix + ".eps"), epsSaveOpts);

// `Save a Copy` as a `...Black.pdf` file in the designated `Print` folder.
rgbDoc.saveAs(new File(docDirectory + "/Print/" + fileName + "_Black" + suffix + ".pdf"), pdfSaveOpts);

// `Save a Copy` as a `...Black.pdf` file in the designated `Digital` folder.
rgbDoc.saveAs(new File(docDirectory + "/Digital/" + fileName + "_Black" + suffix + ".pdf"), pdfSaveOpts);

// `Export` as a `...Black.jpg` file in the designated `Digital` folder.
jpgFile = new File(docDirectory + "/Digital/" + fileName + "_Black" + suffix + ".jpg");
rgbDoc.exportFile(jpgFile, ExportType.JPEG, exportJPEG);

// `Export` as a `...Black.png` file in the designated `Digital` folder.
pngFile = new File(docDirectory + "/Digital/" + fileName + "_Black" + suffix + ".png");
rgbDoc.exportFile(pngFile, ExportType.PNG24, exportPNG);

// `Export` as a `...Black.svg` file in the designated `Digital` folder.
svgFile = new File(docDirectory + "/Digital/" + fileName + "_Black" + suffix + ".svg");
rgbDoc.exportFile(svgFile, ExportType.SVG, exportSVG);

// Apply `#FFFFFF` (white) to primary and secondary logo elements.
recolorItems(rgbDoc.layers.getByName("Primary"), white);
recolorItems(rgbDoc.layers.getByName("Secondary"), white);

// Set artboard setting to colored background.
// CANNOT BE DONE WITH SCRIPT

// Save a Copy of the .AI file in white.
rgbDoc.saveAs(new File(docDirectory + "/" + fileName + suffix + "_White-" + dateStr + ".ai"));

// `Save a Copy` as a `...White.eps` file in the designated `Print` folder.
rgbDoc.saveAs(new File(docDirectory + "/Print/" + fileName + "_White" + suffix + ".eps"), epsSaveOpts);

// `Save a Copy` as a `...White.pdf` file in the designated `Print` folder.
rgbDoc.saveAs(new File(docDirectory + "/Print/" + fileName + "_White" + suffix + ".pdf"), pdfSaveOpts);

// `Save a Copy` as a `...White.pdf` file in the designated `Digital` folder.
rgbDoc.saveAs(new File(docDirectory + "/Digital/" + fileName + "_White" + suffix + ".pdf"), pdfSaveOpts);

// `Export` as a `...White.jpg` file in the designated `Digital` folder.
jpgFile = new File(docDirectory + "/Digital/" + fileName + "_White" + suffix + ".jpg");
rgbDoc.exportFile(jpgFile, ExportType.JPEG, exportJPEG);

// `Export` as a `...White.png` file in the designated `Digital` folder.
pngFile = new File(docDirectory + "/Digital/" + fileName + "_White" + suffix + ".png");
rgbDoc.exportFile(pngFile, ExportType.PNG24, exportPNG);

// `Export` as a `...White.svg` file in the designated `Digital` folder.
svgFile = new File(docDirectory + "/Digital/" + fileName + "_White" + suffix + ".svg");
rgbDoc.exportFile(svgFile, ExportType.SVG, exportSVG);

// FUNCTIONS -------------------------------------------------------------------

/**
 * Recolors the items recursively.
 * @param {CompoundPathItem|GroupItem|Layer|PageItem|PathItem|TextFrame} item - The item to recolor.
 * @param {Color} fillColor - The new fill color.
 */
function recolorItems(item, fillColor){
    if(item.typename === "GroupItem" || item.typename === "Layer") {
        for(var i = 0; i < item.pageItems.length; i++){
            recolorItems(item.pageItems[i], fillColor);
        }
    }
    else if (item.typename === "CompoundPathItem" ){
        for(var j = 0; j < item.pathItems.length; j++){
            recolorItems(item.pathItems[j], fillColor);
        }
    }
    else if(item.typename === "PathItem") {
        item.fillColor = fillColor;
    }
    else if(item.typename === "TextFrame") {
        item.textRange.fillColor = fillColor;
    }
    else {
        alert("Unknown item type: " + item.typename);
    }
}

/**
 * Pads the start of a string with a specified character until it reaches a target length.
 * 
 * @param {string} string - The string to pad.
 * @param {number} targetLength - The target length of the padded string.
 * @param {string} [padString='0'] - The character used for padding. Defaults to '0'.
 * @returns {string} The padded string.
 */
function padStart(string, targetLength, padString) {
    string = string + ''; // coerce to string
    padString = padString || '0'; // default pad string is '0'
    while (string.length < targetLength) {
        string = padString + string;
    }
    return string;
}

/**
 * Returns the current date as a MMDDYY formatted string.
 * @returns {string} The formatted date string.
 */
function dateStr() {
    var today = new Date();
    var dd = padStart(today.getDate(), 2);
    var mm = padStart(today.getMonth() + 1, 2); // January is 0!
    var yy = padStart(today.getFullYear() % 100, 2);
    return mm + dd + yy;
}

/**
 * Copies all layers from the old document to the new document.
 * 
 * @param {Document} oldDoc - The original document to copy layers from.
 * @param {Document} newDoc - The new document to copy layers to.
 */
function copyLayers(oldDoc, newDoc) {
    for (var i = 0; i < oldDoc.layers.length; i++) {
        var layer = oldDoc.layers[i];
        var newLayer = newDoc.layers.add();
        newLayer.name = layer.name;

        for (var j = 0; j < layer.pageItems.length; j++) {
            var pageItem = layer.pageItems[j];
            pageItem.duplicate(newLayer, ElementPlacement.PLACEATEND);
        }
    }
}
