import {
    Component, OnInit, ElementRef,
    ViewEncapsulation, Input, SimpleChange, OnChanges, OnDestroy
} from '@angular/core';
import {
    PageService, PageHierarchyModel, PageModel,
    PagePermissionService, PagePermissionModel
} from './components';
import { ResponseModel, AuthModel, UtilityService } from '../../../shared';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'page-functionality-hierarchy',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/page.functionality.hierarchy.view.html',
    styleUrls: ['./styles/page.functionality.hierarchy.style.scss']
})
export class PageFunctionalityHierarchyComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public currentDepartmentId: number;
    @Input() public selectCanViewForAll: boolean;
    @Input() public selectHODOnlyForAll: boolean;

    public treeObject: any;
    public allSelectForView: boolean = false;
    public allSelectForOnlyHOD: boolean = false;
    public pageHierarchies: PageHierarchyModel[];
    public pages: PageModel[];
    public currentSelectedPageIds: number[];
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    private credential: AuthModel;
    private pagePermissions: PagePermissionModel[]

    constructor(private pageService: PageService,
        private pagePermissionService: PagePermissionService,
        private elementRef: ElementRef) { }

    public ngOnInit(): void {
        this.credential = UtilityService.getCredentialDetails();
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['currentDepartmentId'] !== undefined &&
            (changes['currentDepartmentId'].currentValue !== changes['currentDepartmentId'].previousValue)) {

            if (changes['currentDepartmentId'].currentValue == 0) {
                this.ClearAllTreeData();
                this.allSelectForView = false;
                this.allSelectForOnlyHOD = false;
            } else {
                this.GetPagePermissionTree(this.currentDepartmentId);
            }
        }
    }

    public ExpandCollapsPageTree($event): void {
        this.ExpandCollapsTree($event.checked);
    }

    public SearchAndExpandNodeByName(searchText: string): void {
        let searchedText = jQuery(searchText).val();
        if (this.pages.length > 0 && searchedText != '') {
            const re = new RegExp(searchedText, 'gi'); ///${searchText}/gi; 
            const scearchedNodes: PageModel[] = this.pages.filter(p => re.test(p.PageName));
            const $tree: any = jQuery(this.elementRef.nativeElement).find(`#pageTree`).tree();

            if (scearchedNodes.length > 0 && $tree !== undefined) {
                this.currentSelectedPageIds = scearchedNodes.map(x => x.PageId);
                if (this.currentSelectedPageIds.length > 0) {
                    this.ExpandCollapsTree(true);

                    this.currentSelectedPageIds.forEach(x => {
                        const $node = $tree.getNodeById(x);
                        if ($node != undefined) {
                            $tree.expand($node);
                            let $nodeTextElement = $node.find('> [data-role="wrapper"] > [data-role="display"]');
                            $nodeTextElement.css('background-color', 'yellow');
                        }
                    });
                }
            }
        }
    }

    public ClearSearchHighlights(searchText: string): void {
        jQuery(searchText).val('');
        this.ExpandCollapsTree(false);

        let terrObj = this.treeObject;
        if (terrObj != undefined && this.currentSelectedPageIds != undefined && this.currentSelectedPageIds.length > 0) {
            this.currentSelectedPageIds.forEach(x => {
                const $node = terrObj.getNodeById(x);
                
                if ($node != undefined) {
                    let $nodeTextElement = $node.find('> [data-role="wrapper"] > [data-role="display"]');
                    $nodeTextElement.removeAttr('style');
                }
            });
        }
    }

    private ExpandCollapsTree(isExpand: boolean): void {
        let terrObj = this.treeObject;
        if (terrObj !== undefined) {
            if (isExpand)
                terrObj.expandAll();
            else
                terrObj.collapseAll();
        }
    }

    private GetPagePermissionTree(departmentId: number): void {
        const observables: Observable<ResponseModel<any>>[] = new Array<Observable<ResponseModel<any>>>();
        observables.push(this.pageService.GetPageHierarchy());
        observables.push(this.pagePermissionService.GetPermissionByDepartmentId(departmentId));

        Observable.forkJoin(observables)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((responses: Array<ResponseModel<any>>) => {
                if (responses.length == 2) {
                    this.pages = <PageModel[]>responses[0].Records;
                    this.pagePermissions = <PagePermissionModel[]>responses[1].Records;

                    this.pageHierarchies = this.pageService.PreparePageHierarchyData
                        (this.pages, this.pagePermissions);

                    const allPagesString: string = JSON.stringify(this.pageHierarchies);
                    this.PrepareTrewView(this.pageHierarchies, 'page');
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private PrepareTrewView(treeData: PageHierarchyModel[], treeType: string) {
        this.ClearAllTreeData(treeType);

        this.treeObject = jQuery(`#pageTree`).tree({
            primaryKey: 'id',
            uiLibrary: 'bootstrap4',
            iconsLibrary: 'fontawesome',
            dataSource: treeData,
            checkedField: 'CanView',
            textField: 'text',
            icons: {
                expand: '<i class="fa fa-chevron-right" aria-hidden="true"></i>',
                collapse: '<i class="fa fa-chevron-down" aria-hidden="true"></i>'
            },
            autoLoad: true,
            checkboxes: true,
            cascadeCheck: false,
            nodeDataBound: ((e, $node, id, record) => {
                let $nodeTextElement = $node.find('> [data-role="wrapper"] > [data-role="display"]');
                let isHodChecked: string = record.OnlyHOD ? 'checked' : '';

                $node.find('> [data-role="wrapper"] > [data-role="display"]');
                if ($nodeTextElement.length > 0) {
                    $nodeTextElement.html(`
                        <span class="node-caption ${record.Type.toLocaleLowerCase()}"> 
                            ${record.Type.toLocaleUpperCase()} (${record.ModuleName})
                        </span>
                        <span class="node-text">${record.text}</span>
                        <span data-role="hod-checkbox" title="Apply for HOD only">
                            <label class="gj-checkbox-bootstrap gj-checkbox-bootstrap-4 gj-checkbox-fontawesome">
                                <input type="checkbox" class="chk-hod-only" ${record.CanView ? '' : 'disabled'} data-page-id="${id}" ${isHodChecked}>
                                <span class="fa"></span>
                            </label>
                            <small style="padding: 4px;">Only HOD</small>
                        </span>`);
                }
            })
        });

        let treeObj = this.treeObject;
        this.treeObject.on('checkboxChange', function (e, $node, record, state) {
            let $chkHODOnly = $node.find(`> [data-role="wrapper"] > [data-role="display"] 
            > [data-role="hod-checkbox"] input.chk-hod-only`);
            let isCanViewChecked: boolean = (state == 'checked') ? true : false;

            //Enable/Disable HOD-Only checkbox witb respect to CanView checkbox state
            if ($chkHODOnly.length > 0) {
                $chkHODOnly.prop('disabled', !isCanViewChecked);
                if (!isCanViewChecked)
                    $chkHODOnly.prop('checked', false);
            }

            //Check and Un-Check cascade for all children nodes.
            let children = treeObj.getChildren($node);
            if (children && children.length > 0) {
                children.forEach((id: number) => {
                    if (isCanViewChecked)
                        treeObj.check(treeObj.getNodeById(id));
                    else
                        treeObj.uncheck(treeObj.getNodeById(id));
                });
            }

            //In case of any node got checked leaving the parent unchecked, 
            //enforce the parent node to be checked.
            if (isCanViewChecked) {
                $node.parents('li[data-role="node"]')
                    .find('>[data-role="wrapper"]>[data-role="checkbox"] input:checkbox')
                    .each((index: number, $parentChk: any) => {
                        jQuery($parentChk).prop('checked', true);
                        let $hodChk = jQuery($parentChk)
                            .closest('[data-role="wrapper"]')
                            .find('>[data-role="display"] > [data-role="hod-checkbox"] input.chk-hod-only:checkbox');

                        if ($hodChk.length > 0) {
                            $hodChk.prop('disabled', false);
                        }
                    });
            }
        });
    }

    private ClearAllTreeData(treeType?: string): void {
        let terrObj = this.treeObject;
        if (terrObj !== undefined && terrObj.destroy != undefined) {
            terrObj.destroy();
        }
    }

    public CheckUncheckAllTreeviewNodes(isChecked: boolean): void {
        let terrObj = this.treeObject;
        if (terrObj !== undefined) {
            if (isChecked)
                terrObj.checkAll();
            else
                terrObj.uncheckAll()
        }
    }

    public CheckUncheckAllTreeviewNodesHOD(isChecked: boolean): void {
        let terrObj = this.treeObject;
        if (terrObj !== undefined) {
            let checkedNodes = terrObj.getCheckedNodes();

            if (checkedNodes.length > 0) {
                checkedNodes.forEach((nodeId: number) => {
                    let $node = terrObj.getNodeById(nodeId);
                    let $chkHODOnly = $node.find(`> [data-role="wrapper"] > [data-role="display"] 
                    > [data-role="hod-checkbox"] input.chk-hod-only`);

                    if ($chkHODOnly.length > 0) {
                        $chkHODOnly.prop('checked', isChecked);
                    }
                });
            }
        }
    }

    public GeneratePagePermissionData(selectedDepartmentId: number): PagePermissionModel[] {
        let pagePermissions: PagePermissionModel[] = [];
        let terrObj = this.treeObject;

        if (terrObj !== undefined) {
            var checkedNodes = terrObj.getCheckedNodes();
            if (checkedNodes.length > 0) {
                checkedNodes.forEach((nodeId: number) => {
                    let $node = terrObj.getNodeById(nodeId);

                    let $chkHODOnly = $node.find(`> [data-role="wrapper"] > [data-role="display"] 
                    > [data-role="hod-checkbox"] input.chk-hod-only`);

                    let pagePermission: PagePermissionModel = new PagePermissionModel();
                    pagePermission.DepartmentId = selectedDepartmentId;
                    pagePermission.PageId = nodeId;
                    pagePermission.CanView = true;
                    pagePermission.CanEdit = true;
                    pagePermission.CanDelete = true;
                    pagePermission.OnlyHOD = $chkHODOnly.prop('checked');
                    pagePermission.ActiveFlag = 'Active';
                    pagePermission.CreatedBy = +this.credential.UserId;
                    pagePermission.CreatedOn = new Date();
                    pagePermissions.push(pagePermission);
                });
            }
        }
        return pagePermissions;
    }
}