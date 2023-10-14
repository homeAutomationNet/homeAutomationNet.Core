import { html, css, BaseCustomWebComponentConstructorAppend } from '@node-projects/base-custom-webcomponent';

export type TreeItem = {
    title?: string;
    icon?: string;
    folder?: boolean;
    description?: string;
    callback?: (event, data: Fancytree.EventData) => void;
    contextMenu?: (e: Event, data: Fancytree.EventData) => void;
    expanded?: boolean;
    children?: TreeItem[];
    lazy?: boolean;
    lazyload?: (item: TreeItem, data: Fancytree.EventData) => Promise<TreeItem[]>;
    data?: any;

    //roles?: Roles[];
};

export class FancyTree extends BaseCustomWebComponentConstructorAppend {
    tree: TreeItem[];
    _selectedNode: TreeItem;

    static readonly style = css`
        #root > ul {
            border: none;
            outline: none;
        }

        .servicestate {
            position: absolute;
            left: 24px;
            top: 8px;
            width: 14px;
        }

        .fancytree-node {
            position: relative;
        }
    `;

    static readonly template = html`
        <div style="width:100%; height:100%">
            <div id="treeDiv" style="overflow: auto; width:100%; height:100%"></div>
        </div>`;

    private _treeDiv: HTMLDivElement;
    private _serviceNodeMap: Map<string, HTMLImageElement> = new Map();
    private _tree: Fancytree.Fancytree;
    private _interval: NodeJS.Timeout;

    constructor() {
        super();
    }

    ready() {
        this.shadowRoot.adoptedStyleSheets = [CombinedStyles.ui_fancytreeStyleSheet, this.constructor.style];
    }

    _userContextChangedCallback: (e: any) => void;

    private drawTree() {
        this._treeDiv = this._getDomElement<HTMLDivElement>('treeDiv');
        let nodesToDelete = [];
        let checkRoles = (node) => {
            if (node.children) {
                node.children.forEach((n) => {
                    if (n.data.roles) {
                        let roles: Roles[] = n.data.roles;
                        let userRoles = commonClient.currentUserHasRoles(roles.join(';'));
                        if (!userRoles) {
                            nodesToDelete.push(n);
                        }
                    } else {
                        checkRoles(n);
                    }
                });
            }
        };

        $(this._treeDiv).fancytree(<Fancytree.FancytreeOptions>{
            icon: false,
            source: this.tree,
            copyFunctionsToData: true,

            createNode: (event, data) => {
                checkRoles(data.node);

                let span = data.node.span as HTMLSpanElement;
                if (data.node.data.nodeType == 'service') {
                    let img = document.createElement('img');
                    img.src = './assets/images/config/tree/stopped.png';
                    img.className = 'servicestate';
                    data.node.span.appendChild(img);

                    this._serviceNodeMap.set(data.node.title, img);
                }

                span.oncontextmenu = (e) => {
                    data.node.setActive();
                    if (data.node.data.contextMenu) data.node.data.contextMenu(e, data);
                    e.preventDefault();
                    return false;
                };
            },
            dblclick: (event, data) => {
                if (data.node.data.callback) data.node.data.callback(event, data);
                return false;
            },
            lazyLoad: function (event, data) {
                data.result = (<TreeItem>data.node.data).lazyload(data.node.data, data);
            }
        });

        //@ts-ignore
        this._tree = $.ui.fancytree.getTree(this._treeDiv);
        this._treeDiv.children[0].classList.add('fancytree-connectors');

        this._tree.getRootNode().children[0].setExpanded(true);

        /*
        let uniqueNodesToDelete = [...new Set(nodesToDelete)];
        uniqueNodesToDelete.forEach((node) => {
            try {
                node.remove();
            } catch (err) {

            }
        });*/
    }
}

customElements.define('fancy-tree', FancyTree);
