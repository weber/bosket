// @flow

import React from "react"

// Bosket imports
import { TreeView } from "bosket/react"
import { string } from "bosket/tools"
import { dragndrop } from "bosket/core/dragndrop"

// Model
import model from "self/common/models/TreeViewModel"

export class TreeViewDemo extends React.PureComponent {

    // Load the drag image once on component creation.
    constructor(props: { selection: Object[], update: Object[] => void }) {
        super(props)
        this.dragImage = new Image()
        this.dragImage.src = "../assets/drag-image.svg"
    }
    dragImage: Image

    // The TreeView rendering
    render = () =>
        <TreeView
            selection={ this.props.selection }
            { ...this.state }>
        </TreeView>

    // The state is passed down to the TreeView.

    // Usually the state object is much shorter.
    // Here we deliberately set a lot of properties for the sake of the example.

    state = {
        // Data model
        model: model,
        // Property of the model containing children
        category: "items",
        // On selection, update the selection array in the parent component
        onSelect: function(items) {
            this.props.update(items)
        }.bind(this),
        // Custom display (with an anchor tag)
        display: (item: Object) => <a>{ item.label }</a>,
        // Alphabetical sort
        sort: (a: Object, b: Object) => a.label.localeCompare(b.label),
        // Unique identifier using an item name
        key: (item: Object) => item.label,
        // Search bu regex
        search: (input: string) => (i: Object) => string(i.label).contains(input),
        strategies: {
            // Use keyboard modifiers
            selection: ["modifiers"],
            click: [],
            // Use the opener to control element folding
            fold: ["opener-control"]
        },
        // Custom css root class name
        css: { TreeView: "TreeViewDemo" },
        // Transitions using react transition group
        transition: {
            transitionName: "TreeViewDemoTransition",
            transitionEnterTimeout: 300,
            transitionLeaveTimeout: 300
        },
        // We mark elements as draggable & droppable
        dragndrop: {
            draggable: true,
            droppable: true,
            // On drag init, set the drag image
            drag: (target: Object, event: DragEvent, ancestors: Object[], neighbours: Object[]) => {
                event.dataTransfer && event.dataTransfer.setDragImage(this.dragImage, 0, 0)
            },
            // On drop, move the element (& the previous selection) to the new position
            drop: (target: Object, item: Object, event: DragEvent) => {
                this.setState({
                    model: dragndrop.drops.selection(
                        target,
                        this.state.model,
                        this.state.category,
                        this.props.selection)
                })
            }
        }
    }
}
