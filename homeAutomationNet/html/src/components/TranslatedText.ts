/*import { commonClient } from '../commonClient/commonClient';
import { common_UpdateTextTranslation } from '../api/CommonApi.js';
import { MccDialog } from '../mccDialogHandler';*/

enum Mode {
    Default = 'default',
    FirstCharIsUpperCase = 'first-char-is-uppercase',
    FirstCharIsLowerCase = 'first-char-is-lowercase',
}

export class TranslatedText extends HTMLElement {
    private static _style: CSSStyleSheet;

    public constructor(text: string = null) {
        super();

        if (!TranslatedText._style) {
            TranslatedText._style = new CSSStyleSheet();
            TranslatedText._style.replaceSync(`
            ::selection {
                background-color: transparent;
            }
            * {
                 user-select: none;
            }
            :host {
                display: inline-flex;
            }`);
        }

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [TT._style];
        this._div = document.createElement('div');
        this._div.style.display = 'inline-flex';
        this._div.style.width = '100%';
        this._div.style.height = '100%';
        this._div.style.alignItems = 'inherit';
        this._div.style.fontFamily = 'inherit';
        this._div.style.justifyContent = 'inherit';
        this._div.style.whiteSpace = 'inherit';
        this._div.style.wordWrap = 'inherit';
        this._div.style.maxWidth = 'inherit';
        shadow.appendChild(this._div);
        this._span = document.createElement('span');
        this._span.style.wordWrap = 'inherit';
        this._span.style.maxWidth = 'inherit';
        this._span.oncontextmenu = this._contextMenu.bind(this);
        this._div.appendChild(this._span);

        this._languageChangedCallback = this._languageChanged.bind(this);

        this._contentObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type == 'characterData' && mutation.target.parentNode == this && mutation.target.nodeType == Node.TEXT_NODE) {
                    this._translate(mutation.target.nodeValue);
                } else if (mutation.type == 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.parentNode == this && node.nodeType == Node.TEXT_NODE) {
                            this._translate(node.nodeValue);
                        }
                    });
                }
            });
        });

        this.removeHtmlTags = this.hasAttribute('remove-html-tags');
        this.useTextLists = this.hasAttribute('use-text-lists');
        this.backupText = this.getAttribute('backup-text');

        if (text != null) {
            this.setText(text);
        } else if (this.hasAttribute('text')) {
            this.setText(this.getAttribute('text'));
        }

        if (this.hasAttribute('mode')) {
            this.mode = <Mode>this.getAttribute('mode');
        }
    }

    public static get observedAttributes(): string[] {
        return ['text'];
    }

    public get text(): string {
        return this._text;
    }
    public set text(value) {
        this.setText(value);
    }

    public connectedCallback(): void {
        document.addEventListener('LanguageChanged', this._languageChangedCallback);

        if (!this.transText) {
            this._translate(null);
        }

        this._contentObserver.observe(this, {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true,
        });
    }

    public disconnectedCallback(): void {
        document.removeEventListener('LanguageChanged', this._languageChangedCallback);
        this._contentObserver.disconnect();
    }

    public attributeChangedCallback(name, oldValue, newValue): void {
        if (name == 'text') {
            this.setText(newValue);
        }
    }

    public setText(text: string): void {
        if (typeof text === 'number')
            text = '' + text
        this.transText = text;
        this._setText();
    }

    private _languageChanged() {
        this._contentObserver.disconnect();
        this._setText();
        this._contentObserver.observe(this, {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true,
        });
    }

    private _translate(newText: string) {
        if (this.childNodes.length == 0) {
            return;
        }

        if (newText) {
            if (this._span.innerHTML != newText) {
                this.transText = newText;
            }
        } else if (!this.transText) {
            if (this._text) {
                this.transText = this._text;
            } else {
                this.transText = this.innerHTML;
                if (this.transText.startsWith('<!---->')) {
                    this.transText = this.transText.replace('<!---->', '').replace('<!---->', ''); //2 times replace here is correct, cause replace in js only replaces one occurence
                }
                if (!this.removeHtmlTags) {
                    this._text = this.transText;
                }
            }
        }

        if (this.removeHtmlTags) {
            this.transText = this.transText.replace(/<[^>]*>/g, '').trim();
            this._text = this.transText;
        }

        this._setText();
    }

    private _setText() {
        if (this.additionalObjects != null) {
            if (typeof this.additionalObjects !== 'object') {
                this.additionalObjects = JSON.parse(this.additionalObjects);
            }
        }

        if (this.additionalObjects != null) {
            if (typeof this.additionalObjects !== 'object') {
                this.additionalObjects = JSON.parse(this.additionalObjects);
            }
        }

        if (commonClient) {
            if (commonClient.canSyncTranslate) {
                let tl = commonClient.translate(this.transText, this.additionalObjects, this.additionalObject, this.useTextLists, this.backupText, this.fallback, this.fallback2);

                switch (this.mode) {
                    case Mode.FirstCharIsUpperCase:
                        tl = tl.charAt(0).toUpperCase() + tl.slice(1);
                        break;
                    case Mode.FirstCharIsLowerCase:
                        tl = tl.charAt(0).toLowerCase() + tl.slice(1);
                        break;
                    default:
                        break;
                }

                if (this._lastText != tl) {
                    this._lastText = tl;
                    if (window.CAN_SHADOW || !this.removeHtmlTags) {
                        if (this._span != null) {
                            const tx = tl.replace(/\\n/g, '<br />');
                            if (this.resizeCallback) {
                                this.resizeCallback(this, tx);
                            }
                            this._span.innerHTML = tx;
                        }
                    } else {
                        this._contentObserver.disconnect();
                        if (!this._tEl) {
                            this._tEl = document.createElement('span');
                            this._span.appendChild(this._tEl);
                        }
                        this._tEl.innerHTML = tl.replace(/\\n/g, '<br />');
                    }
                }
            } else {
                commonClient.translateAsync(this.transText, this.additionalObjects, this.additionalObject, this.useTextLists).then((tl) => {
                    if (this._lastText != tl) {
                        this._lastText = tl;
                        if (!this.removeHtmlTags) {
                            const tx = tl.replace(/\\n/g, '<br />');
                            if (this.resizeCallback) {
                                this.resizeCallback(this, tx);
                            }
                            this._span.innerHTML = tx;
                            this._text = tx;
                        } else {
                            this._contentObserver.disconnect();
                            if (!this._tEl) {
                                this._tEl = document.createElement('span');
                                this._span.appendChild(this._tEl);
                            }
                            this._tEl.innerHTML = tl.replace(/\\n/g, '<br />');
                        }
                    }
                });
            }
        }
    }

    private _contextMenu(e) {
        if (e.button == 2 && e.ctrlKey) {
            e.preventDefault();
            TT.showTranslationDialog(this.transText);
        }
    }

    public static async showTranslationDialog(transText: string, showToolTip: boolean = true) {
        const langIDUpper = (await commonClient.getActualLanguage()).toUpperCase();

        if (commonClient.currentUserHasRole('CommonTextTranslationsCanModifiy')) {
            MccDialog.show({
                message:
                    '<t-t>STD_TranslationOf</t-t>: ' +
                    transText +
                    ' => [' +
                    langIDUpper +
                    ']' +
                    '<br><br><ul>' +
                    '<label class="sr-only">Translation</label>' +
                    '<input type="text" class="form-control form-control-sm" id="translation" placeholder="Translation" required value="' +
                    commonClient.getTranslation(transText) +
                    '">' +
                    (showToolTip ?
                        '<label class="sr-only" for="description">Description</label>' +
                        '<input type="text" class="form-control form-control-sm" id="description" placeholder="Description" required value="' +
                        commonClient.getTooltipTranslation(transText) +
                        '"></ul>' : ''),
                buttons: [
                    {
                        label: 'Save',
                        cssClass: 'mcc-button mcc-button-success',
                        action: (dialog) => {
                            let text;
                            let tooltipText = null;

                            if (dialog.$modalBody != undefined) {
                                text = dialog.$modalBody[0].querySelector('#translation').value;
                                if (showToolTip)
                                    tooltipText = dialog.$modalBody[0].querySelector('#description').value;
                            } else {
                                text = dialog.querySelector('#translation').value;
                                if (showToolTip)
                                    tooltipText = dialog.querySelector('#description').value;
                            }
                            common_UpdateTextTranslation(transText, commonClient.actLanguage, text, tooltipText);
                            commonClient.updateTranslation(transText, text, tooltipText);
                            document.dispatchEvent(new CustomEvent('LanguageChanged', { detail: text }));
                            dialog.close();
                        },
                    },
                    {
                        label: 'Close',
                        cssClass: 'mcc-button',
                        action: (dialog) => {
                            dialog.close();
                        },
                    },
                ],
            });
        }
    }
}

customElements.define('t-t', TranslatedText);
