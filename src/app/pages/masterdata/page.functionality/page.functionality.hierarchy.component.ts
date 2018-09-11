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
    
    public allSelectForView: boolean = false;
    public allSelectForOnlyHOD: boolean = false;
    public pageHierarchies: PageHierarchyModel[];
    public pages: PageModel[];
    public currentSelectedPageIds: number[];
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    private credential: AuthModel;

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

        const $tree: any = jQuery(this.elementRef.nativeElement).find(`#pageTree`).tree();
        if ($tree != undefined && this.currentSelectedPageIds != undefined && this.currentSelectedPageIds.length > 0) {
            this.currentSelectedPageIds.forEach(x => {
                const $node = $tree.getNodeById(x);
                if ($node != undefined) {
                    let $nodeTextElement = $node.find('> [data-role="wrapper"] > [data-role="display"]');
                    $nodeTextElement.removeAttr('style');
                }
            });
        }
    }

    private ExpandCollapsTree(isExpand: boolean): void {
        let $tree: any = jQuery(this.elementRef.nativeElement).find(`#pageTree`).tree();
        if ($tree !== undefined && $tree.expandAll != undefined && $tree.collapseAll != undefined) {
            if (isExpand)
                $tree.expandAll();
            else
                $tree.collapseAll();
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
                    this.pageHierarchies = this.pageService.PreparePageHierarchyData
                        (<PageModel[]>responses[0].Records, <PagePermissionModel[]>responses[1].Records);

                    const allPagesString: string = JSON.stringify(this.pageHierarchies);
                    this.PrepareTrewView(allPagesString, 'page');
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private PrepareTrewView(treeData: string, treeType: string) {
        this.ClearAllTreeData(treeType);

        let treeObj = jQuery(`#pageTree`).tree({
            primaryKey: 'id',
            uiLibrary: 'bootstrap',
            iconsLibrary: 'fontawesome',
            dataSource: JSON.parse(treeData),
            checkedField: 'CanView',
            icons: {
                expand: '<i class="fa fa-chevron-right" aria-hidden="true"></i>',
                collapse: '<i class="fa fa-chevron-down" aria-hidden="true"></i>'
            },
            autoLoad: true,
            checkboxes: true,
            cascadeCheck: true,
            dataBound: ((e) => {
                jQuery(e.currentTarget)
                    .find('[data-role="wrapper"] [data-role="checkbox"] .gj-checkbox-bootstrap > input:checkbox')
                    .each((index: number, checkBox: any) => {
                        jQuery(checkBox).addClass('chk-canView-only');
                    });
            }),
            nodeDataBound: ((e, $node, id, record) => {
                let $nodeTextElement = $node.find('> [data-role="wrapper"] > [data-role="display"]');
                let isHodChecked: string = record.OnlyHOD ? 'checked' : '';

                if ($nodeTextElement.length > 0) {
                    $nodeTextElement.html(`
                        <span class="node-caption ${record.Type.toLocaleLowerCase()}"> 
                            ${record.Type.toLocaleUpperCase()} (${record.ModuleName})
                        </span>
                        <span class="node-text">${record.text}</span>
                        <span data-role="hod-checkbox" title="Apply for HOD only">
                            <label class="gj-checkbox-bootstrap">
                                <input type="checkbox" class="chk-hod-only" ${record.CanView ? '' : 'disabled'} data-page-id="${id}" ${isHodChecked}>
                                <span></span>
                            </label>
                            <small style="padding: 4px;">Only HOD</small>
                        </span>`);
                }
            })
        });


        treeObj.find('.gj-checkbox-bootstrap > input.chk-canView-only')
            .on('change', (e) => {
                let $chkHODOnly = jQuery(e.currentTarget)
                    .closest('[data-role="checkbox"]')
                    .siblings('[data-role="display"]')
                    .find('> [data-role="hod-checkbox"] input.chk-hod-only:checkbox');

                if ($chkHODOnly.length > 0) {
                    let isChecked: boolean = jQuery(e.currentTarget).prop('checked');
                    $chkHODOnly.prop('disabled', !isChecked);
                    if (!isChecked)
                        $chkHODOnly.prop('checked', isChecked);
                }
            });
    }

    private ClearAllTreeData(treeType?: string): void {
        let $tree: any = jQuery(this.elementRef.nativeElement).find(`#pageTree`).tree();
        if ($tree !== undefined && $tree.destroy != undefined) {
            $tree.destroy();
        }
    }

    public CheckUncheckAllTreeviewNodes(isChecked: boolean): void {
        let $tree: any = jQuery(this.elementRef.nativeElement).find(`#pageTree`);

        if ($tree !== undefined) {
            $tree.find('.gj-checkbox-bootstrap > input.chk-canView-only')
                .each((index: number, checkBox: any) => {
                    jQuery(checkBox).prop('checked', isChecked);
                    jQuery(checkBox).trigger('change');
                });
        }
    }

    public CheckUncheckAllTreeviewNodesHOD(isChecked: boolean): void {
        let $tree: any = jQuery(this.elementRef.nativeElement).find(`#pageTree`);
        if ($tree !== undefined) {
            var $checkedNodes = $tree.find(`[data-role="wrapper"] [data-role="checkbox"] 
            .gj-checkbox-bootstrap > input.chk-canView-only:checked`);

            if ($checkedNodes.length > 0) {
                $checkedNodes.each((index: number, viewOnlyCheckBox: any) => {
                    let $chkHODOnly = jQuery(viewOnlyCheckBox)
                        .closest('[data-role="checkbox"]')
                        .siblings('[data-role="display"]')
                        .find('> [data-role="hod-checkbox"] input.chk-hod-only:checkbox');

                    if ($chkHODOnly.length > 0) {
                        $chkHODOnly.prop('checked', isChecked);
                    }
                });
            }
        }
    }

    public GeneratePagePermissionData(selectedDepartmentId: number): PagePermissionModel[] {
        let pagePermissions: PagePermissionModel[] = [];
        let $tree: any = jQuery(this.elementRef.nativeElement).find(`#pageTree`);

        if ($tree !== undefined) {
            let $checkedNodes = $tree.find(`[data-role="wrapper"] [data-role="checkbox"] 
            .gj-checkbox-bootstrap > input.chk-canView-only:checked`);

            if ($checkedNodes.length > 0) {
                $checkedNodes.each((index: number, viewOnlyCheckBox: any) => {
                    let pageId = jQuery(viewOnlyCheckBox).closest('li.list-group-item').data('id');
                    let $chkHODOnly = jQuery(viewOnlyCheckBox)
                        .closest('[data-role="checkbox"]')
                        .siblings('[data-role="display"]')
                        .find('> [data-role="hod-checkbox"] input.chk-hod-only:checkbox');

                    let pagePermission: PagePermissionModel = new PagePermissionModel();
                    pagePermission.DepartmentId = selectedDepartmentId;
                    pagePermission.PageId = +pageId;
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