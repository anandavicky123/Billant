package com.softgasm.billant.ui.adapter.calculations.others;

/**
 * Collection of helper methods to identify the position of:
 * - the section in the system
 * - the section components in the system
 * - section items in the section itself
 */
/* default */ interface SectionPositionIdentifier {

    /**
     * Helper method that returns the position of header in the system.
     *
     * @return position of the header in the system
     */
    int getHeaderPosition();

    /**
     * Helper method that returns the position of footer in the system.
     *
     * @return position of the footer in the system
     */
    int getFooterPosition();

    /**
     * Return the section position in the system.
     *
     * @return position of the section in the system
     */
    int getSectionPosition();

    /**
     * Helper method that receives position in relation to the section, and returns the position in
     * the system.
     *
     * @param position position of the item in the section
     * @return position of the item in the system
     */
    int getPositionInAdapter(final int position);

    /**
     * Return the item position in the section.
     *
     * @param position position of the item in the system
     * @return position of the item in the section
     */
    int getPositionInSection(final int position);
}
