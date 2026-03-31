export default class Dropdown {
    /**
     * This defines the constructor method. 
     * It takes ther parameters: id, options and defaultOption.
     */
    constructor(id, options, defaultOption) {
        this.dropdown = d3.select(`#${id}`);
        this.options = options;
        this.defaultOption = defaultOption;

        this.populateDropdown();
        this.setDefaultOption();
        this.addChangeListener();
    }

    /**
     * The populateDropdown() method populates the dropdown with selectable options based on the provided options array.
     */
    populateDropdown() {
        this.options.forEach(option => this.dropdown
            .append('option')
            .attr('value', option)
            .text(option));
    }

    /**
     * The setDefaultOption() method sets the default selected option of the dropdown 
     * element to the defaultOption value passed to the constructor.
     */
    setDefaultOption() {
        this.dropdown.property('value', this.defaultOption);
    }

    /**
     * The addChangeListener(callback) method adds event listener to the dropdown element.
     * When the dropdown value changes, it runs the callback() function. 
     */
    addChangeListener(callback) {
            this.dropdown.on('change', function () {
                callback();
            });
    }

    /**
     * The getValue() method retrieves the current selected value of the dropdown element. 
     * It checks if the dropdown element exists. If it does, it returns the selected value, else it returns null.
     */
    getValue() {
        return this.dropdown ? this.dropdown.property('value') : null;
    }
}


