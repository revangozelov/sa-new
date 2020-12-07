/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//onwheel="new UserStory().mainGuiZoomWheel(event)"
//$(".Assigne-card-story-search").on("keyup", function () {
//    var value = $(this).val().toLowerCase();
//    $(".Assigne-card-story-select-content").filter(function () {
//        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
//    });
//});



var current_js_code_id = "";
var cr_gui_classes = {};
var cr_comp_input_classes = {};
var cr_cont_input_classes = {};
var cr_input_comp_attribute = {};
var cr_input_cont_attribute = {};





function getJsCodeByProject() {
    if (!global_var.current_project_id)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetJsCodeList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {

            var obj = res.tbl[0].r;
            for (var i = 0; i < obj.length; i++) {
                var o = obj[i];
                try {
                    if (o.fnType === 'core') {
                        if (!o.fnCoreName) {
                            continue;
                        }
                        var st = '';
                        st += 'function ' + o.fnCoreName + "(" + o.fnCoreInput + "){";
                        st += o.fnBody;
                        st += '}';

                        var sc = $('<script>').append(st);
                        $('#mainBodyDivForAll').append(sc);

                    } else if (o.fnType === 'event') {
                        if (!o.fnEvent || !o.fnEventObject) {
                            continue;
                        }
                        var st = '';
                        st += '$(document).on("' + o.fnEvent.trim() + '","' + o.fnEventObject.trim() + '", function(e){';
                        st += o.fnBody;
                        st += '})';

                        var sc = $('<script>').append(st);
                        $('#mainBodyDivForAll').append(sc);

                    }
                } catch (err) {
                }
            }
            
        }
    });
}



function getInputAttributeByProject() {
    if (!global_var.current_project_id)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);

    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetInputAttributeListByProject",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            cr_input_comp_attribute = {};
            cr_input_cont_attribute = {};
            var obj = res.tbl[0].r;
            for (var i = 0; i < obj.length; i++) {
                var o = obj[i];
                if (o.attrType === 'comp') {
                    var kv = {};
                    kv[o.attrName] = o.attrValue;
                    if (!cr_input_comp_attribute[o.fkInputId]) {
                        cr_input_comp_attribute[o.fkInputId] = [];
                    }
                    cr_input_comp_attribute[o.fkInputId].push(kv)

                } else if (o.attrType === 'cont') {
                    var kv = {};
                    kv[o.attrName] = o.attrValue;
                    if (!cr_input_cont_attribute[o.fkInputId]) {
                        cr_input_cont_attribute[o.fkInputId] = [];
                    }
                    cr_input_cont_attribute[o.fkInputId].push(kv)
                }
            }
        }
    });
}

function getInputClassRelByProject() {
    if (!global_var.current_project_id)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);

    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetInputClassRelByProject",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            cr_comp_input_classes = {};
            cr_cont_input_classes = {};

            var obj = res.tbl[0].r;
            for (var i = 0; i < obj.length; i++) {
                var o = obj[i];
                if (o.relType === 'comp') {
                    cr_comp_input_classes[o.fkInputId] = (cr_comp_input_classes[o.fkInputId])
                            ? cr_comp_input_classes[o.fkInputId] + "," + o.fkClassId
                            : o.fkClassId;
                } else if (o.relType === 'cont') {
                    cr_cont_input_classes[o.fkInputId] = (cr_cont_input_classes[o.fkInputId])
                            ? cr_cont_input_classes[o.fkInputId] + "," + o.fkClassId
                            : o.fkClassId;
                }
            }
        }
    });
}



function deleteJsCodeClass() {

    if (!current_js_code_id)
        return;


    if (!confirm("Are you sure?")) {
        return;
    }

    var json = initJSON();
    json.kv.id = current_js_code_id;

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteJsCode",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getAllJsCodeByProject();

        }
    });
}




$(document).on("change", ".jsCodeModal_checkbox", function (e) {
    jsCodeModal_checkbox_action();
})

function jsCodeModal_checkbox_action() {
    if ($('.jsCodeModal_checkbox').val() === 'core') {
        $('.jscode-corepart').show();
        $('.jscode-eventpart').hide();
    } else {
        $('.jscode-corepart').hide();
        $('.jscode-eventpart').show();
    }
}


$(document).on("click", ".jscode-row-tr", function (e) {
    $('.jscode-row-tr').removeClass('jscode-row-tr-active');
    $(this).addClass('jscode-row-tr-active');

    var val = $(this).attr('pid');
    if (!val) {
        return;
    }

    current_js_code_id = val;

    var json = initJSON();
    json.kv.id = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetJsCodeById",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#jsCodeModal_fndescription').val(res.kv.fnDescription);
            $('#jsCodeModal_fncorename').val(res.kv.fnCoreName);
            $('#jsCodeModal_fnbody').val(res.kv.fnBody);
            $('#jsCodeModal_fncoreinput').val(res.kv.fnCoreInput);
            $('#jsCodeModal_fnevent').val(res.kv.fnEvent);
            $('#jsCodeModal_fneventobject').val(res.kv.fnEventObject);
            $('#jsCodeModal_isactive').val(res.kv.isActive);
            $('#jsCodeModal_fntype').val(res.kv.fnType);

            jsCodeModal_checkbox_action();

        }
    });
})

function insertNewJsFuncionDesc() {
    var fnDesc = $('#jsCodeModal_newfunction').val();
    if (!fnDesc)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.fnDescription = fnDesc;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewJsCode",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getAllJsCodeByProject();
            $('#jsCodeModal_newfunction').val('');
            $('.jscode-row-tr[pid="' + res.kv.id + '"]').first().click();
        }
    });
}

function getAllJsCodeByProject() {

    if (!global_var.current_project_id)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetJsCodeList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getAllJsCodeByProjectDetails(res);
        }
    });
}

function getAllJsCodeByProjectDetails(res) {
    var table = $('#jsCodeModal_fnlist');
    table.html('');
    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var tr = $("<tr>")
                .addClass('jscode-row-tr')
                .attr("pid", o.id)
                .append($('<td>')
                        .css("cursor", "pointer")
                        .text(o.fnDescription))
        table.append(tr);
    }
    if (current_js_code_id) {
        $(".jscode-row-tr[pid='" + current_js_code_id + "']").first().click();
    } else {
        $(".jscode-row-tr").first().click();
    }
}



function showJsCodeModal() {
    $('#jsCodeModal').modal('show');
    getAllJsCodeByProject();
}

function guiClassModal(el) {
    $('#guiClassModal').modal('show');
    getAllGuiClassByProject();
}


function getAllGuiClassByProject() {

    if (!global_var.current_project_id)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetAllGuiClassByProject",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getAllGuiClassByProjectDetails(res);
        }
    });
}

function getAllGuiClassByProjectDetails(res) {
    var table = $('#guiClassModal_classlist');
    table.html('');
    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var tr = $("<tr>")
                .addClass('gui-class-row-tr')
                .attr("pid", o.id)
                .append($('<td>')
                        .css("cursor", "pointer")
                        .text(o.className))
        table.append(tr);
    }
    if (current_clicked_class_id) {
        $(".jgui-class-row-tr[pid='" + current_clicked_class_id + "']").first().click();
    } else {
        $(".gui-class-row-tr").first().click();
    }
}


function updateGuiClassBody(el) {
    var classBody = $(el).val();
    if (!current_clicked_class_id || !classBody)
        return;

    var json = initJSON();
    json.kv.id = current_clicked_class_id;
    json.kv.classBody = classBody;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateGuiClassBody",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getAllGuiClassByProject();
        }
    });
}

function updateGuiClassName(el) {
    var className = $(el).val();
    if (!current_clicked_class_id || !className)
        return;

    var json = initJSON();
    json.kv.id = current_clicked_class_id;
    json.kv.className = className;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateGuiClassName",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getAllGuiClassByProject();
        }
    });
}

function deleteGuiClass() {

    if (!current_clicked_class_id)
        return;


    if (!confirm("Are you sure?")) {
        return;
    }

    var json = initJSON();
    json.kv.id = current_clicked_class_id;

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteGuiClass",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getAllGuiClassByProject();

        }
    });
}



var current_clicked_class_id = "";


$(document).on("click", ".gui-class-row-tr", function (e) {
    $('.gui-class-row-tr').removeClass('gui-class-row-tr-active');
    $(this).addClass('gui-class-row-tr-active');

    var val = $(this).attr('pid');
    if (!val) {
        return;
    }

    current_clicked_class_id = val;

    var json = initJSON();
    json.kv.id = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetGuiClassById",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#guiClassModal_classname').val(res.kv.className);
            $('#guiClassModal_classbody').val(res.kv.classBody);
        }
    });
})

$(document).on("change", ".classListOnChange", function (e) {
    var val = $(this).val();
    if (val === '-2') {
        $('.input4NewClassAdding').show();
    } else {
        $('.input4NewClassAdding').hide();
    }
})

$(document).on("change", ".classListOnChange4Container", function (e) {
    var val = $(this).val();
    if (val === '-2') {
        $('.input4NewClassAdding4Container').show();
    } else {
        $('.input4NewClassAdding4Container').hide();
    }
})


function insertNewClassDirect(el) {
    var className = $('#gui_prop_in_gui_class_new').val();
    if (className.trim().length === 0) {
        return;
    }
    className = "." + className;
    className = className.replace(/ /g, '');
    insertNewGuiClass(className);
    $(".input4NewClassAdding").hide();
}

function insertNewClassDirect4Container(el) {
    var className = $('#gui_prop_cn_gui_class_new').val();
    if (className.trim().length === 0) {
        return;
    }
    className = "." + className;
    className = className.replace(/ /g, '');
    insertNewGuiClass4Container(className);
    $(".input4NewClassAdding4Container").hide();
}



function insertNewGuiClassModal() {
    var className = $('#guiClassModal_newclass').val();
    if (!className)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.className = className;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewGuiClass",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getAllGuiClassByProject();
            $('#guiClassModal_newclass').val('');
            $('.gui-class-row-tr[pid="' + res.kv.id + '"]').first().click();
        }
    });
}




function insertNewGuiClass4Container(className) {

    if (!className)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.className = className;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewGuiClass",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getGuiClassList();
            $("#gui_prop_cn_gui_class_list").val(res.kv.id);
            $('#gui_prop_cn_gui_class_new').val('');
        }
    });
}


function insertNewGuiClass(className) {

    if (!className)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.className = className;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewGuiClass",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getGuiClassList();
            getAllGuiClassList();
            $("#gui_prop_in_gui_class_list").val(res.kv.id);
            $('#gui_prop_in_gui_class_new').val('');
        }
    });
}

function addGuiClassToInput4Container(el) {
    var classId = $("#gui_prop_cn_gui_class_list").val();
    if (!classId)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.fkClassId = classId;
    json.kv.fkInputId = global_var.current_us_input_id;
    json.kv.relType = "cont";
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddGuiClassToInput",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getInputContaierClassList();
            getInputClassRelByProject();
            new UserStory().genGUIDesign();
        }
    });
}

function addGuiClassToInput(el) {
    var classId = $("#gui_prop_in_gui_class_list").val();
    if (!classId)
        return;

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.fkClassId = classId;
    json.kv.fkInputId = global_var.current_us_input_id;
    json.kv.relType = "comp";
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddGuiClassToInput",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getInputCompClassList();
            getInputClassRelByProject();
            new UserStory().genGUIDesign();
        }
    });
}

function getInputCompClassList() {
    var inputId = global_var.current_us_input_id;
    if (!inputId)
        return;
    getInputCompClassListCore(inputId);
}



function getInputCompClassListCore(inputId) {

    if (!inputId)
        return;

    var json = initJSON();
    json.kv.fkInputId = inputId;
    json.kv.relType = "comp";
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetInputCompClassList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getInputCompClassListDetails(res);
        }
    });
}

function showClassDetails(classId) {
    $('#guiClassModal').modal("show");
    getAllGuiClassByProject();
    $('.gui-class-row-tr[pid="' + classId + '"]').first().click();
}

function getInputCompClassListDetails(res) {
    var table = $('#input_class_list_in_component');
    table.html('');
    try {
        var obj = res.tbl[0].r;
        for (var i = 0; i < obj.length; i++) {
            var o = obj[i];
            var tr = $("<tr>")
                    .append($('<td>')
                            .append($('<a>')
                                    .attr("href", "#")
                                    .attr("onclick", "showClassDetails('" + o.fkClassId + "')")
                                    .attr("title", o.classBody)
                                    .text(o.className)
                                    .append((o.classBody) ? $('<span>')
                                            .css("color", "red")
                                            .text("*") : ""))
                            )
                    .append($('<td>').append($('<i>')
                            .css("cursor", "pointer")
                            .attr('onclick', 'removeInputClassRel(this,"' + o.id + '")')
                            .addClass("fa fa-trash")));

            table.append(tr);
        }
    } catch (err) {

    }
}

function getInputContaierClassList() {
    var inputId = global_var.current_us_input_id;
    if (!inputId)
        return;
    getInputContainerClassListCore(inputId);
}

function getInputContainerClassListCore(inputId) {

    if (!inputId)
        return;

    var json = initJSON();
    json.kv.fkInputId = inputId;
    json.kv.relType = "cont";
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetInputCompClassList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getInputContainerClassListCoreDetailes(res);
        }
    });
}

function getInputContainerClassListCoreDetailes(res) {
    var table = $('#input_class_list_cn_component');
    table.html('');
    try {
        var obj = res.tbl[0].r;
        for (var i = 0; i < obj.length; i++) {
            var o = obj[i];
            var tr = $("<tr>")
                    .append($('<td>')
                            .append($('<a>')
                                    .attr("href", "#")
                                    .attr("onclick", "showClassDetails('" + o.fkClassId + "')")
                                    .attr("title", o.classBody)
                                    .text(o.className)))
                    .append($('<td>').append($('<i>')
                            .css("cursor", "pointer")
                            .attr('onclick', 'removeInputClassRel(this,"' + o.id + '")')
                            .addClass("fa fa-trash")));

            table.append(tr);
        }
    } catch (err) {

    }
}

function removeInputClassRel(el, relId) {
    if (!relId) {
        return;
    }

    if (!confirm("Are you sure?")) {
        return;
    }

    var json = initJSON();
    json.kv.id = relId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmRemoveInputClassRel",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getInputCompClassList();
            getInputContaierClassList();
            getInputClassRelByProject();
            new UserStory().genGUIDesign();
        }
    });
}



function getAllGuiClassList() {
    if (!global_var.current_project_id) {
        return;
    }

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetGuiClassList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            try {

                setResArrayAsObject(res);
            } catch (ee) {
            }
        }
    });
}


function getGuiClassList() {
    if (!global_var.current_project_id) {
        return;
    }

    var json = initJSON();
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetGuiClassListByProject4Combo",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            try {
                getGuiClassListDetails(res);
                getGuiClassListDetails4Container(res);

            } catch (ee) {
            }
        }
    });
}

function setResArrayAsObject(res) {
    try {
        cr_gui_classes = {};
        var obj = res.tbl[0].r;
        for (var i = 0; i < obj.length; i++) {
            var o = obj[i];
            cr_gui_classes[o.id] = o;
        }
    } catch (err) {
        console.log('error in setResArrayAsObject--->>>', JSON.stringify(res))
    }
}

function getGuiClassListDetails(res) {
    var select = $('#gui_prop_in_gui_class_list');
    select.html('');

    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        select.append($('<option>').val(o.id).text(o.className))
    }

    sortSelectBox('gui_prop_in_gui_class_list');
    select.prepend($('<option disabled>').val('').text(''))
            .prepend($('<option>').val('-2').text('New Class'))
            .prepend($('<option>').val('').text(''))

            ;
}

function getGuiClassListDetails4Container(res) {
    var select = $('#gui_prop_cn_gui_class_list');

    select.html('');
    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        select.append($('<option>').val(o.id).text(o.className))
    }

    sortSelectBox('gui_prop_cn_gui_class_list');
    select.prepend($('<option disabled>').val('').text(''))
            .prepend($('<option>').val('-2').text('New Class'))
            .prepend($('<option>').val('').text(''))

            ;
}




function addInputAttributes4Container(el) {
    var attrName = $('#gui_prop_cn_attr_name').val();
    var attrVal = $('#gui_prop_cn_attr_value').val();

    if (!attrName || !attrVal) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.attrName = attrName;
    json.kv.attrValue = attrVal;
    json.kv.fkInputId = global_var.current_us_input_id;
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.fkBacklogId = global_var.current_backlog_id;
    json.kv.attrType = "cont";


    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewInputAttribute",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            $('#gui_prop_cn_attr_name').val('');
            $('#gui_prop_cn_attr_value').val('');
            getInputAttributeList4Container(global_var.current_us_input_id);
            getInputAttributeByProject();
            new UserStory().genGUIDesign();
        }
    });
}


function getInputAttributeList4Container(inputId) {

    if (!inputId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkInputId = inputId;
    json.kv.attrType = "cont";

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetInputAttributeList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getInputAttributeListDetails4Container(res);
        }
    });
}

function getInputAttributeListDetails4Container(res) {
    var table = $('#input_attributes_list_cn_component');
    table.html('');
    try {
        var obj = res.tbl[0].r;
        for (var i = 0; i < obj.length; i++) {
            var o = obj[i];
            var tr = $("<tr>")
                    .append($('<td>').text(o.attrName))
                    .append($('<td>').text(o.attrValue))
                    .append($('<td>').append($('<i>')
                            .css("cursor", "pointer")
                            .attr('onclick', 'removeInputAttribute(this,"' + o.id + '")')
                            .addClass("fa fa-trash")));

            table.append(tr);
        }
    } catch (err) {

    }
}

function addInputAttributes(el) {
    var attrName = $('#gui_prop_in_attr_name').val();
    var attrVal = $('#gui_prop_in_attr_value').val();

    if (!attrName || !attrVal) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.attrName = attrName;
    json.kv.attrValue = attrVal;
    json.kv.fkInputId = global_var.current_us_input_id;
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.fkBacklogId = global_var.current_backlog_id;
    json.kv.attrType = "comp";


    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewInputAttribute",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            $('#gui_prop_in_attr_name').val('');
            $('#gui_prop_in_attr_value').val('');
            getInputAttributeList(global_var.current_us_input_id);
            getInputAttributeByProject();
            new UserStory().genGUIDesign();
        }
    });
}


function getInputAttributeList(inputId) {

    if (!inputId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkInputId = inputId;
    json.kv.attrType = "comp";

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetInputAttributeList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getInputAttributeListDetails(res);
        }
    });
}

function getInputAttributeListDetails(res) {

    var table = $('#input_attributes_list_in_component');
    table.html('');

    try {
        var obj = res.tbl[0].r;
        for (var i = 0; i < obj.length; i++) {
            var o = obj[i];
            var tr = $("<tr>")
                    .append($('<td>').text(o.attrName))
                    .append($('<td>').text(o.attrValue))
                    .append($('<td>').append($('<i>')
                            .css("cursor", "pointer")
                            .attr('onclick', 'removeInputAttribute(this,"' + o.id + '")')
                            .addClass("fa fa-trash")));

            table.append(tr);

        }
    } catch (err) {
    }
//    $('#input_attributes_list_in_component').html(table);
}

function removeInputAttribute(el, inputAttrId) {

    if (!inputAttrId) {
        return;
    }

    if (!confirm("Are you sure?")) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = inputAttrId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteInputAttribute",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getInputAttributeList(global_var.current_us_input_id);
            getInputAttributeList4Container(global_var.current_us_input_id);
            getInputAttributeByProject();
            new UserStory().genGUIDesign();
        },
        error: function () {
            alert("error")
        }
    });
}

function testIO(el) {

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.entity = "tmBacklog";
    json.kv.startLimit = "2";
    json.kv.endLimit = 10;
    json.kv.backlogName = "%%a%%"
    json.kv.status = 'D';
    json.kv.distinctField = "status,modificationDate,backlogName"
    json.kv.modificationDate = "NE%"

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceIoCoreSelect",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            console.log(JSON.stringify(res));
        }
    });
}

function testIOInsert(el) {

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.entity = "tmBacklog";
    json.kv.backlogName = "kelbetino acseso"
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.backlogNo = "3";
    json.kv.orderNo = "40";
    json.kv.priority = "2"
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceIoCoreInsert",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            console.log(JSON.stringify(res));
        }
    });
}


function testIODelete(id) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.entity = "tmBacklog";
    json.kv.id = id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceIoCoreDelete",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            console.log(JSON.stringify(res));
        }
    });
}

function testIOUpdate(id) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.entity = "tmBacklog";
    json.kv.id = id;
    json.kv.backlogName = "HEtelem PEtelem"
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceIoCoreUpdate",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            console.log(JSON.stringify(res));
        }
    });
}

$(document).on("keyup", ".Assigne-card-story-search", function (e) {
    var filter = $(this).val(), count = 0;
    $(".Assigne-content-user").each(function () {
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
            $(this).fadeOut();

        } else {
            $(this).show();
            count++;
        }
    });

    $(".owner-content-user").each(function () {
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
            $(this).fadeOut();

        } else {
            $(this).show();
            count++;
        }
    });
})


$(document).on("click", ".screen_pgn_count", function (e) {
    var rc = $(this).attr('pid');
    $('.img_slider').hide();
    $('.img_slider_' + rc).show();
    SourcedActivityDiagram.DrawLine();
})


function addRelatedApiModal(el) {
    var descId = $('#addRelatedApiModal-id').val();
    var apidId = $('#addRelatedApiModal-api').val();
    var desc = $('#addRelatedApiModal-shortdesc').val();

    if (!descId || !apidId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = descId;
    json.kv.apiId = apidId;
    json.kv.shortDesc = desc;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddRelatedApiToBacklogDesc",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            $('#addRelatedApiModal').modal('hide');
            new UserStory().getBacklogDesc();
        }
    });
}

function removeRelatedApiFromDesc(descId) {
    if (!confirm("Are you sure?")) {
        return;
    }

    if (!descId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = descId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmRemoveRelatedApiToBacklogDesc",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {

            new UserStory().getBacklogDesc();
        }
    });
}

function toggleRelatedApi4Desc(el) {
    if ($(el).val() === '-2') {
        $('.toggleRelatedApi4DescClass').show();
    } else {
        $('.toggleRelatedApi4DescClass').hide();
    }
}

function addNewApiFromDesc() {
    var val = $('#addRelatedApiModal-newapi').val();
    if (!val) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv['backlogName'] = val;
    json.kv['fkProjectId'] = global_var.current_project_id;
    json.kv['isApi'] = "1";
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogShort",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SACore.addBacklogByRes(res);
            SACore.SetBacklogNo(res.kv.backlogNo, res.kv.id);

            $('.toggleRelatedApi4DescClass').hide();
            loadRelatedAPI4Relation();
            $('#addRelatedApiModal-api').val(res.kv.id);
            $('#addRelatedApiModal-newapi').val('');
//                
        },
        error: function () {
            Toaster.showGeneralError();
        }
    });
}

function addRelatedApi(el, descId) {
    $('#addRelatedApiModal-id').val(descId);
    $('#addRelatedApiModal').modal('show');
    loadRelatedAPI4Relation();
}

function loadRelatedAPI4Relation() {
//    addRelatedApiModal-api
    $('#addRelatedApiModal-api').html('');
    var keys = SACore.GetBacklogKeys();
    for (var i in keys) {
        if (SACore.GetBacklogDetails(keys[i], "isApi") !== '1') {
            continue;
        }
        if (keys[i] === global_var.current_backlog_id) {
            continue;
        }
        var backlogId = keys[i];
        var backlogName = SACore.GetBacklogname(backlogId);
        var op = $("<option>")
                .val(backlogId)
                .append(replaceTags(backlogName));
        if (keys[i] === global_var.last_select_from_us_id) {
            op.attr("selected", true);
        }
        $('#addRelatedApiModal-api').append(op);
    }
    sortSelectBox('addRelatedApiModal-api');
    $('#addRelatedApiModal-api')
            .prepend($("<option disabled>").val("").append("                   "));
    $('#addRelatedApiModal-api')
            .prepend($("<option>").val("-2").append("New API"));
}

$(document).on("change", "#selectTableSize", function (e) {
    $('#entityDatabaseList').change();
})





$(document).on("click", ".removeFieldLink", function (e) {
    $('#removeFieldLinkModal').modal('show');
    var fieldId = $(this).closest('div.feildSection').attr('id');
    $('#removeFieldLinkModal-id').val(fieldId);
    getFieldLink(fieldId)
})

$(document).on("dblclick", ".sad-apicard", function (e) {
    $(this).find('.sad-api-card-input').toggle();
    $(this).find('.sad-api-card-output').toggle();
    SourcedActivityDiagram.CoreLines.DrawLines.All();
})

$(document).on("dblclick", ".sad-storycard", function (e) {
    $(this).find('.sad-story-card-input').toggle();
    SourcedActivityDiagram.CoreLines.DrawLines.All();
})

$(document).on("dblclick", ".sad-entitycard", function (e) {
    $(this).find('.sad-entity-input').toggle();
    SourcedActivityDiagram.CoreLines.DrawLines.All();
})


function getFieldLink(fieldId) {
    if (!fieldId)
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = fieldId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetFieldLink",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getFieldLinkDetails(res);
        }
    });
}

function deleteLinkFromFieldRel(fieldId) {
    if (!fieldId)
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = fieldId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteFieldRel",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            var id = $('#removeFieldLinkModal-id').val();
            getFieldLink(id);
            getFieldRel4Select();
        }
    });
}

function getFieldLinkDetails(res) {
    $('#removeFieldLinkModal-tablelist').html("");
    var table = $('<table>').addClass("table table-hover");
    table.append($('<tr>')
            .append($('<th>').append("From"))
            .append($('<th>').append("To"))
            .append($('<th>').append("")));

    try {
        var idx1 = getIndexOfTable(res, "fromTable");
        var objFrom = res.tbl[idx1].r;
        for (var i in objFrom) {
            var o = objFrom[i];
            var tr = $('<tr>')
                    .append($('<td>')
                            .css("color", "orange")
                            .append(SAEntity.GetFieldDetails(o.fromFieldId, 'fieldName')))
                    .append($('<td>').append(SAEntity.GetFieldDetails(o.toFieldId, 'fieldName')))
                    .append($('<td>')
                            .append($('<a href="#">')
                                    .attr("onclick", "deleteLinkFromFieldRel('" + o.id + "')")
                                    .append("Remove"))
                            )
            table.append(tr);
        }
    } catch (err) {
    }

    try {
        var idx2 = getIndexOfTable(res, "toTable");
        var objTo = res.tbl[idx2].r
        for (var j in objTo) {
            var o = objTo[j];
            var tr = $('<tr>')
                    .append($('<td>').append(SAEntity.GetFieldDetails(o.fromFieldId, 'fieldName')))
                    .append($('<td>')
                            .css("color", "orange")
                            .append(SAEntity.GetFieldDetails(o.toFieldId, 'fieldName')))
                    .append($('<td>')
                            .append($('<a href="#">')
                                    .attr("onclick", "deleteLinkFromFieldRel('" + o.id + "')")
                                    .append("Remove"))
                            )
            table.append(tr);
        }
    } catch (err) {
    }

    $('#removeFieldLinkModal-tablelist').html(table)

}

$(document).on("change", "#entityDatabaseList", function (e) {
    var id = $(this).val();
    if (!id)
        return;
    var val = $("#entityDatabaseList option:selected").text();
    $('.DatabaseNameH4').html(replaceTags(val))

    getTablesAndFields(id);
    createEntityCardMatrix();
    getFullEntityTdBody();
    entityDiagramInit();
    $(".dragFeildSection")
            .arrangeable({dragSelector: ".dargFeildBtn"});
    $('.leader-line').remove();
    getFieldRel4Select();
//    $('.tdHeader').draggable();
})

function getFullEntityTdBody() {
    var ls = SAEntity.Tables;
    for (var i in ls) {
        var obj = ls[i];
        var order = obj.orderNo;
        var el = (order)
                ? $('.table-segment-' + order)
                : $('.table-segment-idle').first();
        if (order && el.attr('pid')) {
            el = $('.table-segment-idle').first();
        }


        el.append(genUsTableNew(obj.tableName));
        el.attr("pid", obj.id);
        el.removeClass('table-segment-idle');
        el.find('div.TableAdder').hide();
        var fieldDiv = getTableFieldFullBody(obj.id);
        el.find("div.tdBody").html(fieldDiv.html());
    }
}

function getTableFieldFullBody(tableId) {
    var div = $('<dvi>')

    try {
        var ls = SAEntity.TableFields[tableId].split(',');
        for (var i in ls) {
            var obj = SAEntity.Fields[ls[i]];
            div.append(genUsFeild(obj.id, obj.fieldName, obj.orderNo))
        }

    } catch (err) {
    }
    div.append(AddNewFieldSpan())
    return div;
}

function AddNewFieldSpan() {
    return $('<span  class="feildSection">')
            .append($('<button class="btn Addfiledbtn">')
                    .append($('<i class="fas fa-plus">'))
                    .append('Add Field'));
}

function getTablesAndFields(dbid) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.dbId = dbid;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetDBTableAndFields",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            SAEntity.Load(res);
        }
    });
}

function addFieldRel(fkDbId, fromFieldId, toFieldId) {
    if (!fkDbId || !fromFieldId || !toFieldId)
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }


    json.kv.fkDbId = fkDbId;
    json.kv.fromFieldId = fromFieldId;
    json.kv.toFieldId = toFieldId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddFieldRel",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {

        },
        error: function () {
            Toaster.showError("Field didn't updated")
        }
    });
}

function getFieldRel4Select() {
    $('.leader-line').remove();
    var fkDbId = $('#entityDatabaseList').val();
    if (!fkDbId)
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }


    json.kv.dbId = fkDbId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetFieldRelStructureList4Select",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            SAEntity.updateFieldRelByRes(res);
            getFieldRel4SelectDetails();
        },
        error: function () {
            Toaster.showError("Field didn't updated")
        }
    });
}

function getFieldRel4SelectDetails() {
    $('.leader-line').remove();

    var zm = $('#sadMainPage').css('zoom');
    $('#sadMainPage').css('zoom', '');


    var keys = SAEntity.FieldRel;
    for (var k in keys) {
        var from = k;
        var toList = keys[k].split(',');
        for (var j in toList) {
            var to = toList[j];

            try {
                new LeaderLine(document.getElementById(from), document.getElementById(to),
                        {
                            color: 'rgb(41,146,210)',
                            startPlug: 'square',
                            endPlug: 'arrow',
                            dash: {animation: true},
                            size: 4,
                        })
            } catch (err) {
                console.log(err);
            }
        }
    }

    $('#sadMainPage').css('zoom', zm);

}

function updateDbFieldOrderNo(fieldId, orderNo, tableId) {
    if (!fieldId || !orderNo || !tableId)
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }


    json.kv.id = fieldId;
    json.kv.orderNo = orderNo;
    json.kv.fkTableId = tableId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateDbFieldOrderNo",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getFieldRel4Select();
//            SAEntity.updateFieldByRes(res);
        },
        error: function () {
            Toaster.showError("Field didn't updated")
        }
    });
}

function updateDbField(fieldId, fieldName) {
    if (!fieldId || !fieldName)
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }


    json.kv.id = fieldId;
    json.kv.fieldName = fieldName;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateDbField",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
//            SAEntity.updateFieldByRes(res);
        },
        error: function () {
            Toaster.showError("Field didn't updated")
        }
    });
}

function deleteDbField(fieldId) {
    if (!fieldId)
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }


    json.kv.id = fieldId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteDbField",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getFieldRel4Select();
//            SAEntity.updateFieldByRes(res);
        },
        error: function () {
            Toaster.showError("Field didn't deleted")
        }
    });
}


$(document).on("change", "#tableFieldDetailsModal_tabledesc", function () {
    updateDbtableDesc($('#tableFieldDetailsModal_id').val(), $(this).val());
})



function updateDbtableDesc(tableId, desc) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    if (!tableId)
        return;
    json.kv.id = tableId;
    json.kv.description = desc;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateDbTableDesc",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
        },
        error: function () {
            Toaster.showError("Table didn't updated")
        }
    });
}

function updateDbtableOrderNo(tableId, orderNo) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    if (!tableId || !orderNo)
        return;
    json.kv.id = tableId;
    json.kv.orderNo = orderNo;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateDbTableOrderNo",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getFieldRel4Select();
//            SAEntity.updateTableByRes(res);

        },
        error: function () {
            Toaster.showError("Table didn't updated")
        }
    });
}

function updateDbtable(tableId, tableName) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    if (!tableId || !tableName)
        return;
    json.kv.id = tableId;
    json.kv.tableName = tableName;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateDbTable",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            SAEntity.updateTableByRes(res);
        },
        error: function () {
            Toaster.showError("Table didn't updated")
        }
    });
}

function createEntityCardMatrix() {
    var tbl = $('#tablePreview >tbody');
    tbl.html('');
    var nodeCount = 502;
    var colCount = $('#selectTableSize').val();
    var rowCount = Math.round(nodeCount / colCount);
    var idx = 1;
    for (var i = 1; i <= rowCount; i++) {
        var tr = $('<tr>');
        var trEmpty = $('<tr>');
        for (var j = 1; j <= colCount; j++) {
            tr.append($('<td class="tdSeqment">')
                    .addClass("table-segment-idle")
                    .addClass("table-segment-" + idx)
                    .attr("order", idx)
                    .append(GetSingleEntityCard(idx++)))
                    .append($('<td class="tdSeqmentEmpty">').append(""))
                    ;
            trEmpty.append('<td class="tdSeqmentEmpty">').append("")
        }

        tbl.append(tr).append(trEmpty);
    }

}

function GetSingleEntityCard(orderNo) {
    var div = $('<div class="TableAdder">')
            .attr('order', orderNo)
            .append($('<button class="btn tdOpenedBtn">')
                    .append('<i class="fa fa-plus" aria-hidden="true">'));
    return div;
}

function addNewTable(tableName, orderNo, el) {

    var db = $('#entityDatabaseList').val();
    if (!tableName || db.length === 0) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.dbid = db;
    json.kv.tableName = tableName;
    json.kv.orderNo = orderNo;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewTable",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            $(el).closest('.tdSeqment').attr("pid", res.kv.id);
            $(el).closest('.tdSeqment').removeClass('table-segment-idle')

        },
        error: function () {
            Toaster.showError(tableName + " is not inserted");
        }
    });
}

function commitDatabaseOnServer() {
    var dbid = $('#entityDatabaseList').val();
    var dbname = $('#entityDatabaseList :selected').text();

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.dbid = dbid;
    json.kv.dbname = dbname;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmCommitDatabaseOnServer",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            Toaster.showMessage("Database committed successfully!")
        }
    });
}

function createDatabaseModal(el) {
    $('#createDatabaseModal').modal('show');
}

function editDatabaseName(el) {
    $('#createDatabaseModal-id').val($('#entityDatabaseList').val());
    $('#sendDataToModal-dbname').val($('#entityDatabaseList :selected').text());
    $('#createDatabaseModal').modal('show');
}


function dropDatabase(el) {
    var id = $('#entityDatabaseList').val();
    if (!id) {
        return;
    }

//    let databaseNamechoose = $(".selectDataBaseName").val()
//    $(".deletePopUp").css("display", "block")
//    $(".deleteBaseNameFile").text(databaseNamechoose)

    if (!confirm("Are you sure?")) {
        return;
    }

    if (!confirm("All tables and fields will be remove forever. Still Continue?")) {
        return;
    }




    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDropDatabase",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadDatabaseList2ComboEntity();
            $('#sendDataToModal-dbname').val('');
            $('#createDatabaseModal').modal('hide');
            $('#entityDatabaseList').val(res.kv.id);
            $('#entityDatabaseList').change();
        }
    });
}


function createDatabase() {

    var val = $('#sendDataToModal-dbname').val();
    var id = $('#createDatabaseModal-id').val();
    if (!val) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    json.kv.dbName = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewDb",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            SAEntity.updateDbByRes(res);
            loadDatabaseList2ComboEntity();
            $('#sendDataToModal-dbname').val('');
            $('#createDatabaseModal').modal('hide');
            $('#entityDatabaseList').val(res.kv.id);
            $('#entityDatabaseList').change();
        }
    });
}

function loadDatabaseList2ComboEntity() {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetDbList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadDatabaseList2ComboEntityDetails(res);
            $('#entityDatabaseList').change();
        }
    });
}

function loadDatabaseList2ComboEntityDetails(res) {
    $('#entityDatabaseList').html("");
    try {
        var obj = res.tbl[0].r;
        for (var i in obj) {
            var o = obj[i];
            $('#entityDatabaseList')
                    .append($('<option>').val(o.id)
                            .append(o.dbName))
        }
    } catch (err) {

    }
}

$(document).on("change", "#sad-diagram-sclist", function (e) {
    var list = ($(this).val()) ? $(this).val() : [];
    SourcedActivityDiagram.ShowOnlySCInList(list);
    if (list.length > 0) {
        $('#btnActiveSCControl').prop("checked", true);
    }
})



$(document).on("click", ".card-UserStory-edit-exit", function (e) {
    $(document).find(".TaskStoryCardPanel").css("display", "none");
    try {
        getDBStructure4Select();
    } catch (err) {
    }

})


$(document).on("click", '#user-story-is-api', function (e) {

    if ($('#user-story-is-api').is(":checked")) {
        $('.is-api-dependence').hide();
        $('.is-api-dependence-verse').show();
        $("#live-prototype-show-key").hide(600);
//        $('#user-story-show-prototype').prop("checked", false);
//        $('#user-story-show-prototype').change();
        updateUS4ShortChangeDetails('1', 'isApi');
    } else {
        updateUS4ShortChangeDetails('0', 'isApi');
        $('.is-api-dependence').show();
        $('.is-api-dependence-verse').hide();
        if (SACore.GetCurrentBaklogShowPrototype() === '1')
            $("#live-prototype-show-key").show(600);
    }
});
function getDBStructure4Select() {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetDBStructure4Select",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SAEntity.Load(res);
        }
    });
}


function addDatabaseRelation() {
    if ($('#selectFromDbModal-actiontype').val() &&
            $('#selectFromDbModal-input-id').val() && $('#selectFromDbModal-dbid').val() &&
            $('#selectFromDbModal-tableid').val() && $('#selectFromDbModal-fieldid').val()) {

        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.id = $('#selectFromDbModal-input-id').val();
        json.kv.action = $('#selectFromDbModal-actiontype').val();
        json.kv.dbId = $('#selectFromDbModal-dbid').val();
        json.kv.tableId = $('#selectFromDbModal-tableid').val();
        json.kv.fieldId = $('#selectFromDbModal-fieldid').val();
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmAddDatabaseRelation",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: false,
            success: function (res) {
                SAInput.updateInputByRes(res);
                $('#selectFromDbModal').modal('hide');
                getDBStructure4Select();
                SourcedActivityDiagram.Init();
                //backlogun canvas parametrleri set edilir
                $('#gui_input_css_style_canvas').val(SACore.GetCurrentBacklogParam1());
                new UserStory().showCanvasCss(); //backlog canvas parametrleri set edilenden sonra parse ele
                new UserStory().setGuiMainWindowsParam1(SACore.GetCurrentBacklogParam1());
                var st = "";
                var res1 = SAInput.toJSONByBacklog(global_var.current_backlog_id);
                new UserStory().setUserStoryInputsInfoOnGeneralViewDetailsPure4SelectNew(res1);
                new UserStory().setStoryCardOutput(res1);
                if (SACore.GetCurrentBaklogIsApi() !== '1') {
                    st = that.getGUIDesignHTMLPure(res1);
                }
                $('#general-view-task-gui').html(st);
                $('#general-view-task-gui').attr('bid', SACore.GetCurrentBacklogId());
                $('#general-view-task-gui').attr('bcode', makeId(15));
                $('[data-toggle="tooltip"]').tooltip({html: true});
            }
        });
    }
}





function addSourceOfRelationAsAPI4Send() {
    if ($('#sendDataToModal-us-related-api-input-id').val() &&
            $('#sendDataToModal-us-related-apis').val() && $('#sendDataToModal-sus-api-output-id').val()) {

        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.id = $('#sendDataToModal-us-related-api-input-id').val();
        json.kv.sendToBacklogId = $('#sendDataToModal-us-related-apis').val();
        json.kv.sendToInputId = $('#sendDataToModal-sus-api-output-id').val()
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmUpdateInputSendDataTo",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: true,
            success: function (res) {
                SAInput.updateInputByRes(res);
                $('#sendDataToModal').modal('hide');
                getDBStructure4Select();
                SourcedActivityDiagram.Init();
                //backlogun canvas parametrleri set edilir
                $('#gui_input_css_style_canvas').val(SACore.GetCurrentBacklogParam1());
                new UserStory().showCanvasCss(); //backlog canvas parametrleri set edilenden sonra parse ele
                new UserStory().setGuiMainWindowsParam1(SACore.GetCurrentBacklogParam1());
                var st = "";
                var res1 = SAInput.toJSONByBacklog(global_var.current_backlog_id);
                new UserStory().setUserStoryInputsInfoOnGeneralViewDetailsPure4SelectNew(res1);
                new UserStory().setStoryCardOutput(res1);
                if (SACore.GetCurrentBaklogIsApi() !== '1') {
                    st = that.getGUIDesignHTMLPure(res1);
                }
                $('#general-view-task-gui').html(st);
                $('#general-view-task-gui').attr('bid', SACore.GetCurrentBacklogId());
                $('#general-view-task-gui').attr('bcode', makeId(15));
                $('[data-toggle="tooltip"]').tooltip({html: true});
            }
        });
    }
}



function addSourceOfRelationAsAPI() {
    if ($('#us-related-api-input-actiontype').val() && $('#us-related-api-input-id').val() &&
            $('#us-related-apis').val() && $('#sus-api-output-id').val()) {

        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.id = $('#us-related-api-input-id').val();
        json.kv.action = $('#us-related-api-input-actiontype').val();
        json.kv.selectFromBacklogId = $('#us-related-apis').val();
        json.kv.selectFromInputId = $('#sus-api-output-id').val()
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmUpdateInputSelectFrom",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: true,
            success: function (res) {
                SAInput.updateInputByRes(res);
                $('#addRelatedSourceModal').modal('hide');
                getDBStructure4Select();
                SourcedActivityDiagram.Init();
                //backlogun canvas parametrleri set edilir
                $('#gui_input_css_style_canvas').val(SACore.GetCurrentBacklogParam1());
                new UserStory().showCanvasCss(); //backlog canvas parametrleri set edilenden sonra parse ele
                new UserStory().setGuiMainWindowsParam1(SACore.GetCurrentBacklogParam1());
                var st = "";
                var res1 = SAInput.toJSONByBacklog(global_var.current_backlog_id);
                new UserStory().setUserStoryInputsInfoOnGeneralViewDetailsPure4SelectNew(res1);
                new UserStory().setStoryCardOutput(res1);
                if (SACore.GetCurrentBaklogIsApi() !== '1') {
                    st = that.getGUIDesignHTMLPure(res1);
                }
                $('#general-view-task-gui').html(st);
                $('#general-view-task-gui').attr('bid', SACore.GetCurrentBacklogId());
                $('#general-view-task-gui').attr('bcode', makeId(15));
                $('[data-toggle="tooltip"]').tooltip({html: true});
            }
        });
    }
}


function deleteDocument() {
    if (!confirm("Are you sure?")) {
        return;
    }
    if (!global_var.current_doc_id) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = global_var.current_doc_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteDocument",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            newDocument();
        }
    });
}



function deleteForeverStoryCard(id) {
    if (!confirm("Are you sure?")) {
        return;
    }
    if (!id) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteForeverStoryCard",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#storyCardTrashModal').modal('hide');
        }
    });
}




function deleteForeverDocument(id) {
    if (!confirm("Are you sure?")) {
        return;
    }
    if (!id) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteForeverDocument",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#documentTrashModal').modal('hide');
        }
    });
}


function sendBackStoryCard(id) {

    if (!id) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmSendBackStoryCard",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            new UserStory().refreshBacklog();
            $('#storyCardTrashModal').modal('hide');
        }
    });
}


function sendBackDocument(id) {

    if (!id) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmSendBackDocument",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            global_var.current_doc_id = id;
            loadDoc(id);
            $('#documentTrashModal').modal('hide');
        }
    });
}


function deleteDocument() {
    if (!confirm("Are you sure?")) {
        return;
    }
    if (!global_var.current_doc_id) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = global_var.current_doc_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteDocument",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            newDocument();
        }
    });
}


function getStoryCardTrashModal() {

    if (!global_var.current_project_id) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetDeletedStoryCard",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#storyCardTrashModal').modal('show');
            getStoryCardTrashModalDetails(res);
        }
    });
}

function getStoryCardTrashModalDetails(res) {
    $('#storyCardTrashModal-backloglist').html('');
    try {
        var obj = res.tbl[0].r;
        var table = $('<table>')
                .addClass("table table-hover");
        for (var n = 0; n < obj.length; n++) {
            var tr = $('<tr>')
                    .append($('<td>').append(obj[n].backlogName))
                    .append($('<td>')
                            .css('width', '20%')
                            .append($("<a>")
                                    .attr('href', '#')
                                    .attr('onclick', "sendBackStoryCard('" + obj[n].id + "')")
                                    .append("Send back")))
                    .append($('<td>')
                            .css('width', '20%')
                            .append($("<a>")
                                    .attr('href', '#')
                                    .attr('onclick', "deleteForeverStoryCard('" + obj[n].id + "')")
                                    .append("Delete forever")))

            table.append(tr);
        }
        $('#storyCardTrashModal-backloglist').append(table)

    } catch (err) {

    }
}



function getDocumentTrashModal() {

    if (!global_var.current_project_id) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetDeletedDocument",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#documentTrashModal').modal('show');
            getDocumentTrashModalDetails(res);
        }
    });
}

function getDocumentTrashModalDetails(res) {
    $('#documentTrashModal-documentlist').html('');
    try {
        var obj = res.tbl[0].r;
        var table = $('<table>')
                .addClass("table table-hover");
        for (var n = 0; n < obj.length; n++) {
            var tr = $('<tr>')
                    .append($('<td>').append(obj[n].documentName))
                    .append($('<td>')
                            .css('width', '20%')
                            .append($("<a>")
                                    .attr('href', '#')
                                    .attr('onclick', "sendBackDocument('" + obj[n].id + "')")
                                    .append("Send back")))
                    .append($('<td>')
                            .css('width', '20%')
                            .append($("<a>")
                                    .attr('href', '#')
                                    .attr('onclick', "deleteForeverDocument('" + obj[n].id + "')")
                                    .append("Delete forever")))

            table.append(tr);
        }
        $('#documentTrashModal-documentlist').append(table)

    } catch (err) {

    }
}


function updateDocumentName(name, id) {
    if (!name || !id) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    json.kv.name = name;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateDocumentName",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
        }
    });
}

function loadProjectListToEditor() {
    $('#editor-container-pr-list').html($('#projectList').html());
    $('#editor-container-pr-list').change();

    $('.test181').each(function () {
        $(this).attr('checked', true);
        $(this).change();
    })
}

function loadStoryCards4Editor(el) {
    $('.hummingbird-treeview').html('');
    var elId = $(el).val();
    if (!elId) {
        return;
    }

    if (activeContaierName === 'storyCard') {
        loadDetailsOnProjectSelect(elId);
    } else if (activeContaierName === 'entity') {
        loadTablesDB(elId);
    }
}

function loadTablesDB(elId) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.dbId = elId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetDBTableByDbId",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadTables4EditorDetailsResult(res)
            $(".Choose-userstory-popUp").css("display", "block")
            $("#treeview").hummingbird();
        }
    });
}

function SADProjectListChange(el) {
    if ($(el).val().length === 0) {
        return;
    }
    SourcedActivityDiagram.SelectedStoryCardByFiler = [];
    global_var.current_project_id = $(el).val();
    $('#projectList').val($(el).val());
    $('#projectList').change();
}

function loadDetailsOnProjectSelect(projectId) {
    showProgress();
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = projectId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetBacklogList4Select",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        beforeSend: function () {
            showProgress();
        },
        success: function (res) {
            global_var.current_project_id = projectId;
            new UserStory().refreshBacklog();
            loadStoryCards4EditorDetailsResult(res)
            $(".Choose-userstory-popUp").css("display", "block")
            $("#treeview").hummingbird();
            hideProgress();
        },
        error: function () {
            hideProgress();
        }
    });
}

function loadTables4EditorDetailsResult(res) {
    try {
        var obj = res.tbl[0].r;
        var main_li = $('<li>')
                .append($('<i class="fa fa-minus" aria-hidden="true"></i>'))
                .append($('<label style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);">')
                        .append($('<input  id="xnode-0" data-id="custom-0" type="checkbox">'))
                        .append(" &nbsp; All Entities"))
        var ul = $('<ul style="display: block;">');
        for (var n = 0; n < obj.length; n++) {
            var li = $('<li>')
                    .append($('<label style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);">')
                            .append($('<input  class="test181" type="checkbox">')
                                    .attr('pname', replaceTags(obj[n].tableName))
                                    .attr('pdesc', Replace2Primes(replaceTags(obj[n].description)))
                                    .attr('id', obj[n].id))
                            .attr("data-id", obj[n].id)
                            .append(" &nbsp; " + replaceTags(obj[n].tableName)));
            ul.append(li);
        }
        main_li.append(ul)
        $('.hummingbird-treeview').html(main_li);
    } catch (err) {

    }
}


function loadStoryCards4EditorDetailsResult(res) {
    try {
        var obj = res.tbl[0].r;
        var main_li = $('<li>')
                .append($('<i class="fa fa-minus" aria-hidden="true"></i>'))
                .append($('<label style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);">')
                        .append($('<input  id="xnode-0" data-id="custom-0" type="checkbox">'))
                        .append(" &nbsp; All Story Cards"))
        var ul = $('<ul style="display: block;">');
        for (var n = 0; n < obj.length; n++) {
            var li = $('<li>')
                    .append($('<label style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);">')
                            .append($('<input  class="test181" type="checkbox">')
                                    .attr('id', obj[n].id))
                            .attr("data-id", obj[n].id)
                            .append(" &nbsp; " + obj[n].backlogName));
            ul.append(li);
        }
        main_li.append(ul)
        $('.hummingbird-treeview').html(main_li);
    } catch (err) {

    }
}

function documentOnwhile(event) {

// console.log(' on wheel is working')
    if (global_var.is_body_ctrl_pressed === '1') {
//        console.log(' CTRL is pressed OK')
        event.preventDefault();
        if (event.deltaY < 0)
        {
            zoomDocIn();
        } else if (event.deltaY > 0)
        {
            zoomDocOut();
        }
    }

}

function setMainBodyCSS() {
    if (global_var.current_modal === 'loadDocEditor') {
        $('#mainPageContainer')
                .attr("height", "2000px")
                .css("height", "2000px")
                .css("background-color", "#f8f9fa");
    } else {
        $('#mainBodyDivForAll').css("background-color", "");
    }
}

function commmonOnloadAction(el) {
    $('.new-wrapper').css("left", "77px");
    $('#mainBodyDivForAll').css("padding-left", "0px");
    setMainBodyCSS();
    if (global_var.current_modal === 'loadSourceActivity') {
        $('.new-wrapper').css("left", "-10px");
        $('#mainBodyDivForAll').css("padding-left", "0px");

        $('#sad-diagram-projectlist').html($('#projectList').html());
        $('#sad-diagram-projectlist').val(global_var.current_project_id);
//        $('#sad-diagram-projectlist :selected').first().removeAttr("selected")
        $('.selectcustom1').selectpicker();
        loadStoryCard4SAD(global_var.current_project_id);
        $('.selectcustom2').selectpicker();
        $('div.selectcustom1').find('div.dropdown-menu').css("z-index", "1001");
        $('div.selectcustom2').find('div.dropdown-menu').css("z-index", "1001");
    }

    if (global_var.current_modal === 'loadEntityDiagram') {
        $('.new-wrapper').css("left", "-20px");
        $('#mainBodyDivForAll').css("padding-left", "10px");
    }

    if (global_var.current_modal === 'loadDashboard') {
        $('#statistics-projectlist').html($('#projectList').html());
//        $('#statistics-projectlist').prepend($('<option>').text(""))
        $('#statistics-projectlist :selected').first().removeAttr("selected")
        $('.selectcustom1').selectpicker();
//        $('#statistics-projectlist').val("")

    }
}

function showGeneralStatisticsDetailsModal(el) {
    $('#generalStatisticsDetailsModal-list').html('');
    $('#generalStatisticsDetailsModal-details').html('');
    $('#generalStatisticsDetailsModal').modal("show");
    var projectId = $(el).attr('pid');
    var actionType = $(el).attr('action');
    var statusType = $(el).attr('status')

    if (!projectId || !actionType || !statusType) {
        return;
    }

    global_var.current_project_id = projectId;
    new UserStory().refreshBacklog4Stats();
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkProjectId = projectId;
    json.kv.actionType = actionType;
    json.kv.statusType = statusType;
    json.kv.projectList = Statistics.Dashboard.GetProjectList();
    json.kv.sprintList = Statistics.Dashboard.GetSprintList4User();
    json.kv.labelList = Statistics.Dashboard.GetLabelList4User();
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetBacklogListByStatsGroup",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            showGeneralStatisticsDetailsModalDetails(res, actionType);
        }
    });
}

function showGeneralStatisticsDetailsModalByAssignee(el) {
    $('#generalStatisticsDetailsModal-list').html('');
    $('#generalStatisticsDetailsModal-details').html('');
    $('#generalStatisticsDetailsModal').modal("show");
    var projectId = $(el).attr('projectId');
    var assigneeId = $(el).attr('pid');
    var actionType = $(el).attr('action');
    var statusType = $(el).attr('status')




    if (!assigneeId || !actionType || !statusType) {
        return;
    }

    var labelIds = Statistics.Dashboard.GetLabelList4User();
    var sprintIds = Statistics.Dashboard.GetSprintList4User();

//    global_var.current_project_id = projectId;
//    new UserStory().refreshBacklog4Stats();

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkProjectId = projectId;
    json.kv.fkAssigneeId = assigneeId;
    json.kv.actionType = actionType;
    json.kv.statusType = statusType;
    json.kv.fkSprintId = sprintIds;
    json.kv.fkLabelId = labelIds;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetBacklogListByStatsGroupByAssignee",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            showGeneralStatisticsDetailsModalDetailsByAssignee(res, projectId);
        }
    });
}

function showGeneralStatisticsDetailsModalByTask(el) {
    $('#generalStatisticsDetailsModal-list').html('');
    $('#generalStatisticsDetailsModal-details').html('');
    $('#generalStatisticsDetailsModal').modal("show");
    var projectId = $(el).attr('pid');
    var actionType = $(el).attr('action');
    var statusType = $(el).attr('status')

    var labelIds = Statistics.Dashboard.GetLabelList4Task();
    var sprintIds = Statistics.Dashboard.GetSprintList4Task();

    if (!projectId || !actionType || !statusType) {
        return;
    }

    global_var.current_project_id = projectId;
    new UserStory().refreshBacklog4Stats();
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkProjectId = projectId;
    json.kv.actionType = actionType;
    json.kv.statusType = statusType;
    json.kv.fkSprintId = sprintIds;
    json.kv.fkLabelId = labelIds;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetBacklogListByStatsGroupByTask",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            showGeneralStatisticsDetailsModalDetailsByTask(res);
        }
    });
}


function showTaskDetails4Statistic(el) {
    var taskId = $(el).attr("pid");
    if (!taskId) {
        return;
    }

    showTaskCardIn(taskId, 'generalStatisticsDetailsModal-details');
}


function showTaskCardIn(taskId, divId) {
    var html = $('#taskMgmtModal-body').html();
    $("#" + divId).html(html);
    $('.card-UserStory-edit-task').remove();
    loadTaskCardDetails(taskId);
}

function showBacklogDetails4Statistic(el) {
    var backlogId = $(el).attr("pid");
    if (!backlogId) {
        return;
    }

    var projectId = getProjectIdOfBacklog(backlogId);
    if (projectId !== global_var.current_project_id || SACore.GetBacklogKeyList().length === 0) {
        showProgressAlternative();
        global_var.current_project_id = projectId;
        new UserStory().refreshBacklog4Bug();
    }
    hideProgressAlternative();

    showStoryCardIn(backlogId, "generalStatisticsDetailsModal-details");
}

function showGeneralStatisticsDetailsModalDetailsByAssignee(res, projectId) {
    var obj = res.tbl[0].r;
    var table = $('<table>')
            .addClass("table table-hover");
    var idx = 1;
    for (var i in obj) {
        var tr = $('<tr>')
                .addClass("general-statistics-story-card-list")
                .attr("projectId", projectId)
                .attr("pid", obj[i].id)
                .css("cursor", "pointer")

                .append($('<td>').append((idx++)))
                .append($('<td>').append((obj[i].taskName)));
        tr.attr("onclick", "showAssigneeTaskDetails4Statistic(this)")

        table.append(tr);
    }
    $('#generalStatisticsDetailsModal-list').html(table);
    $('#generalStatisticsDetailsModal-list')
            .find('.general-statistics-story-card-list').first().click();
}

function showAssigneeTaskDetails4Statistic(el) {
    var taskId = $(el).attr("pid");
    var projectId = $(el).attr("projectId");
    if (!taskId) {
        return;
    }
    loadTaskInfoToContainer(taskId, projectId);
    showAssigneeTaskCardIn(taskId, 'generalStatisticsDetailsModal-details');
}


function loadTaskInfoToContainer(taskId, projectId) {

    if (taskId.length === 0) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = taskId;
    json.kv.fkProjectId = projectId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskList4Select",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            SATask.updateTaskByRes(res);
        }
    });
}

function showAssigneeTaskCardIn(taskId, divId) {
    var html = $('#taskMgmtModal-body').html();
    $("#" + divId).html(html);
    $("#" + divId).find('.card-UserStory-edit-task').remove();

    var backlogId = SATask.GetDetails(taskId, 'fkBacklogId');
    var o = getBacklogDetailsById(backlogId);
    SACore.AddBacklog(backlogId, o);

    loadTaskCardDetails(taskId);

    $("#" + divId).find('.Story-card-Header-task')
            .css('padding', '0px');
    $("#" + divId).find('.card-UserStory-header-text')
            .css('font-size', '18px');
    $("#" + divId).find('.StorycardHeader').removeClass('sticky-top');



}

function showGeneralStatisticsDetailsModalDetailsByTask(res) {
    var obj = res.tbl[0].r;
    var table = $('<table>')
            .addClass("table table-hover");
    var idx = 1;
    for (var i in obj) {
        var tr = $('<tr>')
                .addClass("general-statistics-story-card-list")
                .attr("pid", obj[i].id)
                .css("cursor", "pointer")

                .append($('<td>').append((idx++)))
                .append($('<td>').append((obj[i].backlogName)));
        tr.attr("onclick", "showTaskDetails4Statistic(this)")

        table.append(tr);
    }
    $('#generalStatisticsDetailsModal-list').html(table);
    $('#generalStatisticsDetailsModal-list')
            .find('.general-statistics-story-card-list').first().click();
}

function showGeneralStatisticsDetailsModalDetails(res, actionType) {
    var obj = res.tbl[0].r;
    var table = $('<table>')
            .addClass("table table-hover");
    var idx = 1;
    var t = ["new", "change", "bug"]
    for (var i in obj) {
        var tr = $('<tr>')
                .addClass("general-statistics-story-card-list")
                .attr("pid", obj[i].id)
                .css("cursor", "pointer")

                .append($('<td>').append((idx++)))
                .append($('<td>').append((obj[i].backlogName)));
        if (t.includes(actionType)) {
            tr.attr("onclick", "showTaskDetails4Statistic(this)")
        } else {
            tr.attr("onclick", "showBacklogDetails4Statistic(this)")
        }
        table.append(tr);
    }
    $('#generalStatisticsDetailsModal-list').html(table);
    $('#generalStatisticsDetailsModal-list')
            .find('.general-statistics-story-card-list').first().click();
}

function loadStoryCard4SAD(fkProjectId) {
    $('#sad-diagram-sclist').html('');
    if (fkProjectId.length === 0) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkProjectId = fkProjectId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetBacklogListByProject",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadStoryCard4SADDetails(res);
        }
    });
}

function loadStoryCard4SADDetails(res) {
    try {
        var el = $('#sad-diagram-sclist');
        var obj = res.tbl[0].r;
        for (var n = 0; n < obj.length; n++) {
            if (obj[n].isApi === '1') {
                continue;
            }
            el.prepend($('<option>')
                    .val(obj[n].id)
                    .text(obj[n].backlogName));
        }

    } catch (err) {

    }
}

function zoomDocIn() {
    event.preventDefault();
    global_var.doc_actual_zoom = (parseInt(global_var.doc_actual_zoom) + 6);
    setDocZoom();
}

function zoomDocOut() {
    event.preventDefault();
    global_var.doc_actual_zoom = (parseInt(global_var.doc_actual_zoom) - 6);
    if (global_var.doc_actual_zoom <= 20) {
        global_var.doc_actual_zoom = 20;
    }
    setDocZoom();
}

function zoomDocReset4SAD() {
    global_var.doc_actual_zoom = 50;
    setDocZoom();
}

function zoomDocReset4ED() {
    global_var.doc_actual_zoom = 65;
    setDocZoom();
}

function zoomDocReset() {
    global_var.doc_actual_zoom = 100;
    setDocZoom();
}


function setDocZoom() {
    $('#testPage,#sadMainPage,#sadMainPage').css('zoom', global_var.doc_actual_zoom + "%");
    if (global_var.current_modal === 'loadSourceActivity') {
        SourcedActivityDiagram.DrawLine();
//        $('#sadMainPage').height($('#mainBodyDivForAll').height());
//        $('#sadMainPage').width($('#mainBodyDivForAll').width());

    }
}



$(document).on("click", "#SaveAsPage", function () {
    saveAsDocumentModal();
})

function saveAsDocumentModal() {
    $('#saveAsDocumentModal').modal("show");
    $('#saveAsDocumentModal-newname').val($('#doc-name').html());
}

function saveAsDocument() {
    if ($('#saveAsDocumentModal-newname').val().trim().length === 0) {
        return;
    }

    global_var.current_doc_id = "";
    $('#doc-name').html($('#saveAsDocumentModal-newname').val().trim());
    saveDocument();
    $('#saveAsDocumentModal').modal("hide");
}

$(document).on('click', '.ded-open-docs', function (evt) {
    openDocument();
});
function newDocument() {
    global_var.current_doc_id = "";
    $('#doc-name').html('Untitled document');
    $('.fr-element').html('');
}

function openDocument() {
    $('#documentListModal').modal("show");
    if (global_var.current_project_id.length === 0) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetDocumentListByProject",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            loadDocuments(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function loadDocuments(res) {
    try {
        var table = $('<table>');
        var obj = res.tbl[0].r;
        for (var n = 0; n < obj.length; n++) {
            var o = obj[n];
            var tr = $("<tr>")
                    .append($("<td>")
                            .append($('<a>')
                                    .attr("href", "#")
                                    .css("cursor", "pointer")
                                    .attr("onclick", "loadDoc('" + o.id + "')")
                                    .append(o.documentName))
                            )
            table.append(tr);
        }

        $('#documentListModal-doclist').html(table);
    } catch (err) {

    }
}

function loadDoc(docId) {
    if (docId.trim().length === 0) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = docId;
    var that = this;
    var data = JSON.stringify(json);
    showProgress();
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetDocument",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            global_var.current_doc_id = docId;
            $('#documentListModal').modal("hide");
//            $('#testPage').html(res.kv.documentBody);
            $('#doc-name').html(res.kv.documentName);
            $('.fr-element').html(res.kv.documentBody);
            hideProgress();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

$(document).on('click', '#SavePage', function (evt) {
    saveDocument();
});
function saveDocument() {
    var docName = $('#doc-name').html();
    var docBody = $('.fr-element').html();
    console.log('doc-body====', docBody)

    if (docName.trim().length === 0 || docBody.trim().length === 0) {
        Toaster.showError("Document Name or Body is empty!");
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.id = global_var.current_doc_id;
    json.kv.documentName = docName;
    json.kv.documentBody = docBody;
    var that = this;
    var data = JSON.stringify(json);
    showProgress();
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewDocument",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            global_var.current_doc_id = res.kv.id;
            Toaster.showMessage("Saved")
            hideProgress();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

$(document).on('click', '.live-prototype-show-story-card', function (evt) {
    if (global_var.current_modal !== "loadStoryCard") {
        var id = global_var.current_backlog_id;
        callStoryCard(id);
    }
});
$(document).on('click', '.redirectClass4CSS', function (evt) {
    var id = $(this).find('.redirectClass').attr('bid');
    new UserStory().setBacklogByGuiAll(id)
});



$(document).on('click', '.loadLivePrototype', function (evt) {
    global_var.current_modal = "loadLivePrototype";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    showToggleMain();
    var f = $(this).data('link');
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        getAllGuiClassList();
        getInputClassRelByProject();
        getInputAttributeByProject();

        new UserStory().clearAll();
        $('#mainBodyDivForAll').html(html_string);
        SACore.FillAllSelectBox();
        $('#show_ipo_toggle').prop("checked", true) //show input list
        showNavBar();
        callLivePrototype();
        commmonOnloadAction(this);
        getGuiClassList();
        getJsCodeByProject();

    });
});
$(document).on('click', '.loadDashboard', function (evt) {
    var f = 'dashboard';
    global_var.current_modal = "loadDashboard";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
        new UserStory().pureClearAll(this);
        commmonOnloadAction(this);
        Statistics.Dashboard.GetProjectSummary();
        Statistics.GelGeneralLabels();
        Statistics.GelGeneralSprints();
        Statistics.GetGeneralUsers();
    });
});
function callLivePrototype() {
    if (global_var.ipo_gui_view === 'all') {
        new UserStory().showAllGUI();
    } else if (global_var.ipo_gui_view === 'single') {
        new UserStory().showCurrentGUI();
    } else {
        new UserStory().showCurrentGUI();
    }
}

$(document).on('click', '.loadDocEditor', function (evt) {
    var f = 'doceditor';
    global_var.current_modal = "loadDocEditor";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
        new UserStory().pureClearAll(this);
        hideToggleMain();
        loadDocEditor();
        commmonOnloadAction(this);
    });
});
$(document).on('click', '.loadStoryCard', function (evt) {
    global_var.current_modal = "loadStoryCard";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    callLoadStoryCard();
});
function callLoadStoryCard() {
    showToggleMain();
    var f = 'storycard';
    loadHtml(f);
}

$(document).on('change', '.user-story-prototype-change', function (evt) {


    if ($(this).is(":checked")) {
        $('#live-prototype-show-key').show(1000);
    } else {
        $('#live-prototype-show-key').hide(1000);
    }

    var ustype = 'showPrototype';
    var val = $(this).is(":checked") ? "1" : "0";
    updateUS4ShortChangeDetails(val, ustype);
});
$(document).on('change', '.user-story-short-change', function (evt) {
    var ustype = $(this).data('type');
    var val = $(this).val();
    updateUS4ShortChange(this, ustype);
});
$(document).on('click', '.neefdiagram-call', function (evt) {
    var f = $(this).data('link');
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string); // this is not Working
        ActivityDiagram.showNeefDiagram('');
    });
});
$(document).on('click', '.loadStoryCardMgmt', function (evt) {
    var f = $(this).data('link');
    global_var.current_modal = "loadStoryCardMgmt";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        new UserStory().clearAndShowAll();
        $('#mainBodyDivForAll').html(html_string);
        new UserStory().setKanbanView(this);
        new Label().load();
        new Sprint().load();
        new UserStory().genUsFilterCreatedBy();
        new UserStory().genUsFilterTaskTypes();
        Priority.load();
        new Label().load();
        hideToggleMain();
        commmonOnloadAction(this);
    });
});
$(document).on('click', '.loadUserManual', function (evt) {
    var f = 'usermanual';
    global_var.current_modal = "loadUserManual";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
        hideToggleMain();
        ProjectPreview.show('');
    });
});
$(document).on('click', '.loadStatistics', function (evt) {
    var f = 'stat';
    global_var.current_modal = "loadStatistics";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
        hideToggleMain();
        commmonOnloadAction(this);
        Statistics.GetGeneralStatsCountNGB.Call();
        Statistics.GetGeneralStatsCountNGB.Call4Group();
    });
});
$(document).on('click', '.loadStatistics', function (evt) {
    var f = 'stat';
    global_var.current_modal = "loadStatistics";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
        hideToggleMain();
        commmonOnloadAction(this);
        Statistics.GetGeneralStatsCountNGB.Call();
        Statistics.GetGeneralStatsCountNGB.Call4Group();
        $('.selectcustom1').selectpicker();
    });
});

$(document).on('click', '.loadActivityDiagram', function (evt) {
    var f = 'activity';
    global_var.current_modal = "loadActivityDiagram";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
//        new UserStory().pureClearAll(this);
        hideToggleMain();
        commmonOnloadAction(this);
//        getDBStructure4Select();
//        loadDatabaseList2ComboEntity();
//        global_var.doc_actual_zoom = 65;
    });
});


$(document).on('click', '.loadEntityDiagram', function (evt) {
    var f = 'entity';
    global_var.current_modal = "loadEntityDiagram";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
        new UserStory().pureClearAll(this);
        hideToggleMain();
        commmonOnloadAction(this);
        getDBStructure4Select();
        loadDatabaseList2ComboEntity();
        global_var.doc_actual_zoom = 65;
    });
});


$(document).on('click', '.loadSourceActivity', function (evt) {
    var f = 'sourceactivity';
    global_var.current_modal = "loadSourceActivity";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
        new UserStory().pureClearAll(this);
        hideToggleMain();
        commmonOnloadAction(this);
        getDBStructure4Select();
        SourcedActivityDiagram.Init();
        $('.selectcustom1').selectpicker();
        $('.selectcustom2').selectpicker();
        global_var.doc_actual_zoom = 65;
    });
});


$(document).on('click', '.loadTestCase', function (evt) {
    var f = $(this).data('link');
    global_var.current_modal = "loadTestCase";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
        hideToggleMain();
        commmonOnloadAction(this);

        getTestCaseList();
        setTestCaseFilterProject()

        loadStoryCardsForTestCase();
        loadCreatedByForTestCase();

        $('#testcase_priority4filter').selectpicker();
//        $('#testcase_projectfilter').html($('#projectList').html());

//         $('#testcase_projectfilter').change();





    });
});

$(document).on('click', '.loadBugChange', function (evt) {
    var f = $(this).data('link');
    global_var.current_modal = "loadBugChange";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
        commmonOnloadAction(this);
        getBugList();
        setBugFilterProject();
        setBugFilterAssignees();
        $('.bug-mgmt-filter-select').selectpicker();
        new Sprint().load4Task();
        new Label().load4Task();

    });
});

$(document).on('click', '.loadBusinessCase', function (evt) {
    var f = 'bcase';
    global_var.current_modal = "loadBusinessCase";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
        hideToggleMain();
        commmonOnloadAction(this);
        getNewExecutiveTable();
    });
});

$(document).on('click', '.loadBusinessService', function (evt) {
    var f = 'bservice';
    global_var.current_modal = "loadBusinessService";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
        hideToggleMain();
        commmonOnloadAction(this);
        loadBCServiceGroup4BS();
        spiltterCodeFn();
    });
});


$(document).on('click', '.loadTaskManagement', function (evt) {
    var f = $(this).data('link');
    global_var.current_modal = "loadTaskManagement";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string);
//        new UserStory().clearAll();
        genTaskKanbanViewTrigger();
        hideToggleMain();
        commmonOnloadAction(this);
        new Sprint().load4Task();
    });
});

function loadUsersAsAssignee() {
    $('.Assigne-card-story-select-content').html('');
    var keys = SAProjectUser.GetKeys();
    var div1 = $('<div class="Assigne-content-user">')
            .attr('pid', "-1")
            .append($('<img class="Assigne-card-story-select-img">')
                    .attr('src', fileUrl(new User().getDefaultUserprofileName())))
            .append($('<span>').append(" Unassigned"));
    $('.Assigne-card-story-select-content').append(div1);
    for (var i = 0; i < keys.length; i++) {
        var userImage = SAProjectUser.GetDetails(keys[i], "userImage");
        var userName = SAProjectUser.GetDetails(keys[i], "userName");
        var img = (userImage)
                ? fileUrl(userImage)
                : fileUrl(new User().getDefaultUserprofileName());
        var div = $('<div class="Assigne-content-user">')
                .attr('pid', keys[i])
                .append($('<img class="Assigne-card-story-select-img">')
                        .attr('src', img))
                .append($('<span>')
                        .append(" ")
                        .append(userName));
        $('.Assigne-card-story-select-content').append(div)
    }
}

function loadUsersAsOwner() {
    $('#story-card-owner-list').html('');
    var keys = SAProjectUser.GetKeys();
    var div1 = $('<div class="owner-content-user">')
            .attr('pid', "-1")
            .append($('<img class="Assigne-card-story-select-img">')
                    .attr('src', fileUrl(new User().getDefaultUserprofileName())))
            .append($('<span>').append(" Unassigned"));
    $('#story-card-owner-list').append(div1);
    for (var i = 0; i < keys.length; i++) {
        var userImage = SAProjectUser.GetDetails(keys[i], "userImage");
        var userName = SAProjectUser.GetDetails(keys[i], "userName");
        var img = (userImage)
                ? fileUrl(userImage)
                : fileUrl(new User().getDefaultUserprofileName());
        var div = $('<div class="owner-content-user">')
                .attr('pid', keys[i])
                .append($('<img class="Assigne-card-story-select-img">')
                        .attr('src', img))
                .append($('<span>')
                        .append(" ")
                        .append(userName));
        $('#story-card-owner-list').append(div)
    }
}
//$(document).on('click', '.dropdownMenuButtonCss', function (evt) {
//   
//    new Sprint().load();
//});

$(document).on('click', '.storydiagram', function (evt) {
    var f = $(this).data('link');
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string); // this is not Working
        ActivityDiagram.showStoryDiagram();
    });
});
$(document).on('click', '.loadProject', function (evt) {
    global_var.current_modal = "loadProject";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    var f = $(this).data('link');
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string); // this is not Working
        new Project().loadProject();
        new User().removeTagsByPermission();
        commmonOnloadAction(this);
    });
});
$(document).on('click', '.loadUser', function (evt) {
    global_var.current_modal = "loadUser";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    hideToggleMain();
    var f = $(this).data('link');
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string); // this is not Working
        new User().loadUser();
        commmonOnloadAction(this);
    });
});
$(document).on('click', '.loadTaskType', function (evt) {
    global_var.current_modal = "loadTaskType";
    Utility.addParamToUrl('current_modal', global_var.current_modal);
    hideToggleMain();
    var f = $(this).data('link');
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string); // this is not Working
        new TaskType().load();
        commmonOnloadAction(this);
    });
});
$(document).on('click', '.inputdiagram', function (evt) {
    var f = $(this).data('link');
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#mainBodyDivForAll').html(html_string); // this is not Working
        ActivityDiagram.showInputDiagram();
    });
});
$(document).on('click', '.task-card-UserStory-edit-exit', function (evt) {
//    $('.StoryCardPanel').modal('hide');
    if (global_var.current_modal === 'loadTaskManagement') {
        genTaskKanbanView();
    } else if (global_var.current_modal === 'loadBugChange') {
        getBugList();
    }


});
function setActiveInputDescType(actionType) {
    global_var.active_input_desc_type = actionType;
}

function loadHtml(file) {
    $.get("resource/child/" + file + ".html", function (html_string)
    {
//        new UserStory().pureClearAll(this);
        new UserStory().clearAndShowAll(this)
        $('#mainBodyDivForAll').html(html_string);
        new UserStory().refreshCurrentBacklog();
        SACore.FillAllSelectBox();
        $('#show_ipo_toggle').prop("checked", true) //show input list
        showNavBar();
        loadUsersAsOwner();
        commmonOnloadAction(this);
    });
}

function setStoryCardOwner() {
    var fkOwnerId = SACore.GetBacklogDetails(global_var.current_backlog_id, "fkOwnerId");
    var userImage = SAProjectUser.GetDetails(fkOwnerId, "userImage");
    var userName = SAProjectUser.GetDetails(fkOwnerId, "userName");
    var img = (userImage)
            ? fileUrl(userImage)
            : fileUrl(new User().getDefaultUserprofileName());
    var userName1 = (userName)
            ? userName
            : ' Unassigned';
    $('#story-card-owner').find('img').attr('src', img);
    $('#story-card-owner').find('span').html(' ' + userName1);
}

function toggleNewUserStory4Section(el) {
    if ($(el).val() === '-2') {
        $('#addUserStoryToSectionModal-newus-toggle').show();
    } else {
        $('#addUserStoryToSectionModal-newus-toggle').hide();
    }
}

function toggleNewUserStory4Tab(el) {
    if ($(el).val() === '-2') {
        $('#addUserStoryToTabModal-newus-toggle').show();
    } else {
        $('#addUserStoryToTabModal-newus-toggle').hide();
    }
}

function fillSectionUserStory(inputId) {
    var backlogId = SAInput.getInputDetails(inputId, "param1");
    $('#addUserStoryToSectionModal').modal('show');
    var res = SACore.toJSON();
    loadSUSList4InputDetailsNew(res, backlogId);
}

function addUserStoryToToSection() {
    if ($('#addUserStoryToSectionModal-userstory').val() === '-2') {
        if ($('#addUserStoryToSectionModal-newus').val().trim().length > 0) {
            var tempBacklogId = global_var.current_backlog_id;
            insertNewBacklogShortQuich($('#addUserStoryToSectionModal-newus'));
        }
    } else {
        new UserStory().setGUIComponentRelSUS($('#addUserStoryToSectionModal-userstory'));
        $('#addUserStoryToSectionModal').modal('hide');
    }
}

function addUserStoryToTab() {
    if ($('#addUserStoryToTabModal-userstory').val() === '-2') {
        if ($('#addUserStoryToTabModal-newus').val().trim().length > 0) {
            var tempBacklogId = global_var.current_backlog_id;
            insertNewBacklogShortQuich4InputTab($('#addUserStoryToTabModal-newus'));
        }
    } else {
        var backlogId = $('#addUserStoryToTabModal-userstory').val();
        addUserStoryToTabList(backlogId);
//        loadAddUserStoriesToTabList($('#addUserStoryToTabModal-id').val())
    }
}

function addUserStoryToTabList(backlogId) {
    if (!backlogId) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBacklogId = global_var.current_backlog_id;
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.fkRelatedBacklogId = backlogId;
    json.kv.fkTabId = $('#addUserStoryToTabModal-id').val();
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddUserStoryToTabList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#addUserStoryToTabModal-newinput').val('');
            SAInput.addInputTabByRes(res);
            //refresh input list
            var st = new UserStory().getHtmlGenIPOInputList(SAInput.toJSON());
            $('#tblIPOList > tbody').html(st);
            global_var.current_us_input_id = res.kv.id;
            $('#ipo_tr_' + res.kv.id).click();
//                $('.us-ipo-input-tr').last().click();

            new UserStory().generateGUIGeneral();
            new UserStory().insertSuplementaryOfNewInputTotal(res.kv.id, res.kv.inputName);
            $('#us-ipo-inputname').val('');
            $('#us-ipo-input-id').val('');
            $('#us-ipo-inputname').focus();
            dragResize();
            global_var.input_insert_cellno = "";
            global_var.input_insert_orderno = "";
            global_var.input_insert_component = "";
            loadAddUserStoriesToTabList($('#addUserStoryToTabModal-id').val());
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function insertNewBacklogShortQuich(el) {
    var val = $(el).val();
    if (!val) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv['backlogName'] = val;
    json.kv['fkProjectId'] = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogShort",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SACore.addBacklogByRes(res);
            SACore.SetBacklogNo(res.kv.backlogNo, res.kv.id);
            SAInput.Inputs[global_var.current_us_input_id].param1 = res.kv.id;
            new UserStory().clearField();
            new UserStory().load();
            new UserStory().loadSUSList4InputDetails(SACore.toJSON());
            $('#addUserStoryToSectionModal').modal('hide');
            $('#addUserStoryToSectionModal-newus').val('');
//            new UserStory().refreshCurrentBacklog();

        },
        error: function () {
            Toaster.showGeneralError();
        }
    });
}

function insertNewBacklogShortQuich4InputTab(el) {
    var val = $(el).val();
    if (!val) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv['backlogName'] = val;
    json.kv['fkProjectId'] = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogShort",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SACore.addBacklogByRes(res);
            SACore.SetBacklogNo(res.kv.backlogNo, res.kv.id);
//            SAInput.Inputs[global_var.current_us_input_id].param1 = res.kv.id;
            new UserStory().clearField();
            new UserStory().load();
            new UserStory().loadSUSList4InputDetails(SACore.toJSON());
            $('#addUserStoryToTabModal-newus').val('');
            addUserStoryToTabList(res.kv.id);
        },
        error: function () {
            Toaster.showGeneralError();
        }
    });
}

function loadSUSList4InputDetailsNew(res, backlogId) {
    try {
        $('#addUserStoryToSectionModal-userstory').html("");
        var obj = res.tbl[0].r;
        for (var n = 0; n < obj.length; n++) {
            if (obj[n].id !== global_var.current_backlog_id) {
                var d = $("<option></option>")
                        .attr("value", obj[n].id)
                        .text(replaceTags(obj[n].backlogName) + "  #" + obj[n].orderNo + " ");
                if (backlogId === obj[n].id) {
                    d.attr("selected", "true");
                }
                $('#addUserStoryToSectionModal-userstory').append(d);
            }
        }

        sortSelectBox('addUserStoryToSectionModal-userstory');
        $('#addUserStoryToSectionModal-userstory')
                .prepend($("<option disabled></option>")
                        .append('--------------------------'))
                .prepend($("<option></option>").val("-2").append("New User Story"))
                .prepend($("<option>None</option>"))


                ;
        $('#addUserStoryToSectionModal-userstory').change();
    } catch (err) {
    }
}

function sortSelectBox(id) {
    var sel = $('#' + id);
    var selected = sel.val(); // cache selected value, before reordering
    var opts_list = sel.find('option');
    opts_list.sort(function (a, b) {
        return $(a).text().toLowerCase() > $(b).text().toLowerCase() ? 1 : -1;
    });
    sel.html('').append(opts_list);
    sel.val(selected); // set cached selected value
}

function addSectionAsInput() {

    $('#us-ipo-inputname').val("Section");
    global_var.input_insert_component = "sctn";
    global_var.input_insert_cellno = "12";
    new UserStory().insertNewInput()
}

function addTableAsInput() {

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBacklogId = global_var.current_backlog_id;
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.rowCount = global_var.component_table_default_row_count;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddTableAsInput",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SAInput.addInputByRes(res);
            SAInput.addInputTableByRes(res);
            SACore.updateBacklogByRes(res);
//                SACore.addInputToBacklog(res.kv.fkBacklogId, res.kv.id);


            //refresh input list
            var st = new UserStory().getHtmlGenIPOInputList(SAInput.toJSON());
            $('#tblIPOList > tbody').html(st);
            global_var.current_us_input_id = res.kv.id;
            $('#ipo_tr_' + res.kv.id).click();
//                $('.us-ipo-input-tr').last().click();

            //generate GUI
            new UserStory().generateGUIGeneral();
            new UserStory().insertSuplementaryOfNewInputTotal(res.kv.id, res.kv.inputName);
            $('#us-ipo-inputname').val('');
            $('#us-ipo-input-id').val('');
            $('#us-ipo-inputname').focus();
            dragResize();
            global_var.input_insert_cellno = "";
            global_var.input_insert_orderno = "";
            global_var.input_insert_component = "";
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


function addUserStoryToTabModal(tabId) {
    if (!tabId) {
        return;
    }

    $('#addUserStoryToTabModal').modal('show');
    $('#addUserStoryToTabModal-id').val(tabId);
    var res = SACore.toJSON();
    loadSUSList4InputTabDetailsNew(res);
    loadAddUserStoriesToTabList(tabId);
}

function loadAddUserStoriesToTabList(tabId) {
    var usList = [];
    try {
        usList = SAInput.Tabs[tabId].fkRelatedBacklogId.split(',');
    } catch (err) {
    }

    var table = $('<table  class="table table-hover spilted input-name-add-table">')
    var idx = 1;
    for (var i in usList) {
        var tr = $('<tr>');
        var usId = usList[i].trim();
        var usName = SACore.GetBacklogname(usId);
        var orderNo = SACore.GetBacklogOrderNo(usId);
        tr.append($('<td>').append(idx++))
                .append($('<td>').append(replaceTags(usName) + " (#" + orderNo + ")"))
                .append($('<td>').append($('<a>')
                        .attr('href', '#')
                        .attr("onclick", "removeBacklogFromTab('" + usId + "','" + tabId + "')")
                        .append($("<i class='fa fa-trash'>").css("color", "red"))))


        table.append(tr);
    }
    $('#addUserStoryToTabModal-assinged-userstories').html(table);
}

function addUserStoryNewModal() {
    $('#addUserStoryPopupModal').modal('show');
}

function addUserStoryNewPopup4SAD() {
    addUserStoryNewPopup();
}

function addUserStoryNewPopup() {
    var usName = $('#addUserStoryPopupModal-userstoryname').val();
    if (!usName)
        return;
    $('#main-user-story-name-4-insert').val(usName);
    $('#main-user-story-name-4-insert').change();
    $('#addUserStoryPopupModal-userstoryname').val('');
    $('#addUserStoryPopupModal').modal('hide');
    if (global_var.current_modal === 'loadSourceActivity') {
        callStoryCard(global_var.current_backlog_id);
    }
}

function removeBacklogFromTab(relatedBacklogId, tabId) {
    if (!relatedBacklogId || !tabId) {
        return;
    }

    if (!confirm("Are you sure?")) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkTabId = tabId
    json.kv.fkRelatedBacklogId = relatedBacklogId;
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmRemoveBacklogFromTab",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SAInput.addInputTabByRes(res);
            loadAddUserStoriesToTabList(tabId);
            new UserStory().genGUIDesign();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function addInputAsInput() {
    $('#addNewComponentModal').modal('show');
}

function loadSUSList4InputTabDetailsNew(res) {
    try {
        $('#addUserStoryToTabModal-userstory').html("");
        var obj = res.tbl[0].r;
        $('#addUserStoryToTabModal-userstory')
                .append($("<option></option>"))

                .append($("<option></option>").val("-2").append("New User Story"))
                .append($("<option disabled></option>")
                        .append('--------------------------'))
                ;
        for (var n = 0; n < obj.length; n++) {
            if (obj[n].id !== global_var.current_backlog_id) {
                var d = $("<option></option>")
                        .attr("value", obj[n].id)
                        .text(replaceTags(obj[n].backlogName) + "  #" + obj[n].orderNo + " ");
                $('#addUserStoryToTabModal-userstory').append(d);
            }
        }
        $('#addUserStoryToTabModal-userstory').change();
    } catch (err) {
    }
}


function addTabAsInput() {

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBacklogId = global_var.current_backlog_id;
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddTabAsInput",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SAInput.addInputByRes(res);
            SAInput.addInputTabByRes(res);
            SACore.updateBacklogByRes(res);
//                SACore.addInputToBacklog(res.kv.fkBacklogId, res.kv.id);


            //refresh input list
            var st = new UserStory().getHtmlGenIPOInputList(SAInput.toJSON());
            $('#tblIPOList > tbody').html(st);
            global_var.current_us_input_id = res.kv.id;
            $('#ipo_tr_' + res.kv.id).click();
//                $('.us-ipo-input-tr').last().click();

            //generate GUI
            new UserStory().generateGUIGeneral();
            new UserStory().insertSuplementaryOfNewInputTotal(res.kv.id, res.kv.inputName);
            $('#us-ipo-inputname').val('');
            $('#us-ipo-input-id').val('');
            $('#us-ipo-inputname').focus();
            dragResize();
            global_var.input_insert_cellno = "";
            global_var.input_insert_orderno = "";
            global_var.input_insert_component = "";
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function inputTableColumnsToggle(el) {
    var val = $(el).val();
    if (val === '-1') {
        $('#inputTableAddColumnsModal-newinput-toggle').show();
    } else {
        $('#inputTableAddColumnsModal-newinput-toggle').hide();
    }
}

function setInputTableReadFromContent(el, tableId) {
    if (!(tableId)) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkInputTableId = tableId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmSetInputTableReadFromContent",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SAInput.addInputTableByRes(res);
            if (res.kv.readContent === "1") {
                $(el).css("color", "#2196F3")
            } else {
                $(el).css("color", "#d5d6da")
            }
            //generate GUI
            new UserStory().generateGUIGeneral();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function showInputTableColumnComponent(el, tableId, inputId) {
    if (!(tableId) || !(inputId)) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkInputTableId = tableId;
    json.kv.fkInputId = inputId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmShowInputTableColumnComponent",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SAInput.addInputTableByRes(res);
            if (res.kv.showComponent === "1") {
                $(el).css("color", "#2196F3")
            } else {
                $(el).css("color", "#d5d6da")
            }

            //generate GUI
            new UserStory().generateGUIGeneral();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function readInputTableProperties(el, inputId) {
    global_var.current_us_input_id = inputId;
    openComponentPropertiesModal();
    $("#ipo_tr_" + inputId).click();
}

function updateRowCountInputTable(tableId, rowCount) {
    if (!(tableId) || !(rowCount)) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkInputTableId = tableId;
    json.kv.rowCount = rowCount;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateRowCountInputTable",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SAInput.addInputTableByRes(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function fillInputTableColumnsCombo(tableId) {
    if (!global_var.current_backlog_id) {
        return;
    }

    if (!tableId) {
        return;
    }


    $('#inputTableAddColumnsModal').modal("show");
    $('#inputTableAddColumnsModal-id').val(tableId);
    var res = SAInput.toJSON();
    var obj = res.tbl[0].r;
    $('#inputTableAddColumnsModal-inputs').html('');
    var st = "<table style=\"width:100%\">";
    var idx = 0;
    for (var n = 0; n < obj.length; n++) {
        if (obj[n].inputType !== 'IN' && obj[n].inputType !== 'GUI') {
            continue;
        }

        if (idx % 5 === 0) {
            st += '</tr><tr>'
        }
        idx++;
        var isChecked = "";
        try {
            isChecked = SAInput.Tables[tableId].fkInputId.includes(obj[n].id) ? " checked " : "";
        } catch (err) {
        }

        st += '<td>'
        st += ' <input type="checkbox" class="input_table_columns_class"  id="in_tbl_'
                + obj[n].id + '" value="' + obj[n].id + '" ' + isChecked + '> ' +
                replaceTags(obj[n].inputName) + '</input>';
        st += '</td>';
    }
    st += '</table>';
    $('#inputTableAddColumnsModal-inputs').append(st);
}

function removeInputTable(el, inputId, tableId) {
    if (!confirm("Are you sure?")) {
        return;
    }


    if (!tableId || !inputId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkInputId = inputId;
    json.kv.fkInputTableId = tableId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmRemoveInputTable",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SAInput.deleteInput(inputId);
            SAInput.deleteInputTable(tableId);
            SACore.updateBacklogByRes(res);
            //refresh input list
            var st = new UserStory().getHtmlGenIPOInputList(SAInput.toJSON());
            $('#tblIPOList > tbody').html(st);
            global_var.current_us_input_id = res.kv.id;
            $('#ipo_tr_' + res.kv.id).click();
//                $('.us-ipo-input-tr').last().click();

            //generate GUI
            new UserStory().generateGUIGeneral();
            new UserStory().insertSuplementaryOfNewInputTotal(res.kv.id, res.kv.inputName);
            $('#us-ipo-inputname').val('');
            $('#us-ipo-input-id').val('');
            $('#us-ipo-inputname').focus();
            dragResize();
            global_var.input_insert_cellno = "";
            global_var.input_insert_orderno = "";
            global_var.input_insert_component = "";
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


function removeSection(el, inputId) {
    if (!confirm("Are you sure?")) {
        return;
    }


    if (!inputId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = inputId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteInput",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SAInput.deleteInput(inputId);
            SACore.updateBacklogByRes(res);
            //refresh input list
            var st = new UserStory().getHtmlGenIPOInputList(SAInput.toJSON());
            $('#tblIPOList > tbody').html(st);
            global_var.current_us_input_id = res.kv.id;
            $('#ipo_tr_' + res.kv.id).click();
//                $('.us-ipo-input-tr').last().click();

            //generate GUI
            new UserStory().generateGUIGeneral();
            new UserStory().insertSuplementaryOfNewInputTotal(res.kv.id, res.kv.inputName);
            $('#us-ipo-inputname').val('');
            $('#us-ipo-input-id').val('');
            $('#us-ipo-inputname').focus();
            dragResize();
            global_var.input_insert_cellno = "";
            global_var.input_insert_orderno = "";
            global_var.input_insert_component = "";
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}



function addColumnsAsInputToTable() {
    var inputId = "";
    $('.input_table_columns_class').each(function () {
        if ($(this).is(":checked")) {
            var id = $(this).val();
            inputId += (id) ? id + "," : "";
        }
    })

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBacklogId = global_var.current_backlog_id;
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.fkInputId = inputId;
    json.kv.newInputName = $('#inputTableAddColumnsModal-newinput').val();
    json.kv.fkInputTableId = $('#inputTableAddColumnsModal-id').val();
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddColumnsAsInputToTable",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#inputTableAddColumnsModal').modal("hide");
            $('#inputTableAddColumnsModal-newinput').val('');
            try {
                SAInput.addInputByRes(res);
                SACore.updateBacklogByRes(res);
            } catch (err) {
            }
            SAInput.addInputTableByRes(res);
            //refresh input list
            var st = new UserStory().getHtmlGenIPOInputList(SAInput.toJSON());
            $('#tblIPOList > tbody').html(st);
            global_var.current_us_input_id = res.kv.id;
            $('#ipo_tr_' + res.kv.id).click();
//                $('.us-ipo-input-tr').last().click();

            //generate GUI
            new UserStory().generateGUIGeneral();
            new UserStory().insertSuplementaryOfNewInputTotal(res.kv.id, res.kv.inputName);
            $('#us-ipo-inputname').val('');
            $('#us-ipo-input-id').val('');
            $('#us-ipo-inputname').focus();
            dragResize();
            global_var.input_insert_cellno = "";
            global_var.input_insert_orderno = "";
            global_var.input_insert_component = "";
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


function insertNewUserStory(el, storyStatus) {
    var storyName = $(el).closest('div.miniStoryCard').find('input').first().val();
    if (!storyName) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv['backlogName'] = storyName;
    json.kv['fkProjectId'] = global_var.current_project_id;
    json.kv['priority'] = "1";
    json.kv.backlogStatus = storyStatus;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewUserStory",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SACore.addBacklogByRes(res);
            SACore.SetBacklogNo(res.kv.backlogNo, res.kv.id);
            global_var.current_backlog_id = res.kv.id;
            Utility.addParamToUrl('current_backlog_id', global_var.current_backlog_id);
            new UserStory().setUSLists4KanbanViewDirect();
            try {
                $('.content-drag').arrangeable();
//                $('.content-drag').draggable();
            } catch (e) {
            }

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function getProjectUsers() {


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv['fkProjectId'] = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmSelectUsersByProject4Select",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            SAProjectUser.LoadProjectUser(res);
            loadUsersAsAssignee();
            loadUsersAsOwner();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function getUsers() {


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv['fkProjectId'] = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceCrGetUserList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SAProjectUser.LoadUser(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function loadAssignedLabel(backlogId, labelId) {
    $('#task-info-change-version').html('');
    $('#task-info-change-version').append($('<option></option>').text("Unassigned"));
    if (!global_var.current_project_id) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.fkBacklogId = backlogId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmLoadAssignedLabel",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            loadAssignedLabelDetails(res);
            $('#task-info-change-version').val(labelId);
        }
    });
}
function  loadAssignedLabelDetails(res) {
    try {
        var obj = res.tbl[0].r;
        $('#task-info-change-version').html('');
        $('#task-info-change-version').append($('<option></option>').text("Unassigned"));
        for (var n = 0; n < obj.length; n++) {
            $('#task-info-change-version')
                    .append($('<option></option>')
                            .val(obj[n].id)
                            .text(obj[n].name));
        }
    } catch (err) {

    }
}

function updateTask4Status(id, backlogNo, status) {

    try {

        if (id.lentgh === 0 || backlogNo.lentgh === 0 || status.lentgh === 0) {
            return;
        }
    } catch (e) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    json.kv.orderNo = backlogNo;
    json.kv.taskStatus = status;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateTask4Status",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            SACore.updateBacklogByRes(res);
            SATask.addTaskByRes(res);
            SATask.RemoveFromOrderNo(id);
            SATask.SetOrderNo(backlogNo, id);
            genTaskKanbanView();
            contentArrangableUI();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function updateUS4Status(id, backlogNo, status) {

    try {

        if (id.lentgh === 0 || backlogNo.lentgh === 0 || status.lentgh === 0) {
            return;
        }
    } catch (e) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    json.kv.backlogNo = backlogNo;
    json.kv.backlogStatus = status;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateUserStsory4Status",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            SACore.addBacklogByRes(res);
            SACore.RemoveFromBacklogNo(id);
            SACore.SetBacklogNo(backlogNo, id);
            global_var.current_backlog_id = res.kv.id;
            Utility.addParamToUrl('current_backlog_id', global_var.current_backlog_id);
            new UserStory().setUSLists4KanbanViewDirect();
            contentArrangableUI();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


function contentArrangableUI() {
    try {
        $('.content-drag').arrangeable();
    } catch (e) {
    }
}

function updateUS4ShortChange(el, ustype) {
    try {

        if (ustype.lentgh === 0 || $(el).val().lentgh === 0) {
            return;
        }
    } catch (e) {
        return;
    }
    updateUS4ShortChangeDetails($(el).val(), ustype);
}

function updateInput4SC(inputId, el, ustype) {
    try {

        if (ustype.lentgh === 0 || $(el).val().lentgh === 0) {
            return;
        }
    } catch (e) {
        return;
    }
    updateInput4SCDetails(inputId, $(el).val(), ustype);
}

function updateInput4SCDetails(inputId, val, ustype) {

    try {

        if (inputId.length === 0 || ustype.lentgh === 0 || val.lentgh === 0) {
            return;
        }
    } catch (e) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = inputId;
    json.kv.type = ustype;
    json.kv.value = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateInput4ShortChange",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SAInput.updateInputByRes(res);
        },
        error: function () {
            Toaster.showError(('Something went wrong!!!'));
        }
    });
}

function updateUS4ShortChangeDetails(val, ustype) {

    try {

        if (ustype.lentgh === 0 || val.lentgh === 0) {
            return;
        }
    } catch (e) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = global_var.current_backlog_id;
    json.kv.type = ustype;
    json.kv.value = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateUserStsory4ShortChange",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SACore.addBacklogByRes(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}




function updateJSChange(el, ustype) {
    try {
        if (ustype.lentgh === 0 || $(el).val().lentgh === 0) {
            return;
        }
    } catch (e) {
        return;
    }
    updateJSChangeDetails($(el).val(), ustype);
}

function updateJSChangeDetails(val, ustype) {
    updateJSChangePure(val, ustype, current_js_code_id);
}

function updateJSChangePure(val, ustype, jsCodeId) {
    try {

        if (ustype.lentgh === 0 || val.lentgh === 0 || jsCodeId === 0) {
            return;
        }
    } catch (e) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = jsCodeId;
    json.kv.type = ustype;
    json.kv.value = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateJSCode4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getAllJsCodeByProject();
        },
        error: function () {
            Toaster.showError("Something went wrong!");
        }
    });
}



function updateTask4ShortChange(el, ustype) {
    try {
        if (ustype.lentgh === 0 || $(el).val().lentgh === 0) {
            return;
        }
    } catch (e) {
        return;
    }
    updateTask4ShortChangeDetails($(el).val(), ustype);
}

function updateTask4ShortChangeDetails(val, ustype) {
    updateTask4ShortChangePure(val, ustype, global_var.current_us_task_id);
}

function updateTask4ShortChangeDetailsWithSync(val, ustype) {
    updateTask4ShortChangePureWithSync(val, ustype, global_var.current_us_task_id);
}

function updateTask4ShortChangePureWithSync(val, ustype, taskId) {
    try {

        if (ustype.lentgh === 0 || val.lentgh === 0 || taskId === 0) {
            return;
        }
    } catch (e) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = taskId;
    json.kv.type = ustype;
    json.kv.value = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateTask4ShortChange",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            SATask.addTaskByRes(res);
            SACore.updateBacklogByRes(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function updateTask4ShortChangePure(val, ustype, taskId) {
    try {

        if (ustype.lentgh === 0 || val.lentgh === 0 || taskId === 0) {
            return;
        }
    } catch (e) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = taskId;
    json.kv.type = ustype;
    json.kv.value = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateTask4ShortChange",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SATask.addTaskByRes(res);
            SACore.updateBacklogByRes(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


function loadMainProjectList4Class() {


    var pid = SACore.GetProjectKeys();
    for (var n = 0; n < pid.length; n++) {
        var pname = SACore.GetProjectName(pid[n]);
        var o = $('<option></option')
                .attr('value', pid[n])
                .html(replaceTags(pname));
        $('.project-list-main').each(function (e) {
            $(this).append(o);
        });
    }

    $('.project-list-main').each(function (e) {
        $(this).val(global_var.current_project_id);
//        $(this).change();
    })
}

function hideNavBar() {
    $('.primary-nav').hide(200);
}

function showNavBar() {
    $('.primary-nav').show(200);
}

function filterByUserStoryName() {
    global_var.userStoryFilter.userstory = $('#searchinput').val();
    new UserStory().setKanbanView(this);
}


function setZadi(height, width) {

    if (width !== undefined && (width))
        $('#gui_prop_cn_generalwidth').val(width);
    if (height !== undefined && (height))
        $('#gui_prop_cn_generalheight').val(height);
    new UserStory().setGUIContainerStyle();
//    new UserStory().setGUIComponentContent(); 
}

$(document).keydown('.tooltipMan', function (ev) {
//    ev.preventDefault();

    return;
    var el = $('#' + global_var.current_us_input_id);
    console.log("keydowned=", el.attr('id'), ' ; top=', el.position().top, '; LEFT=', el.position().left)
    console.log("keycode", ev.keyCode)

    if (ev.keyCode === 37) {

        el.position().left = el.position().left - 1;
    }
    if (ev.keyCode === 38) {
        console.log('38')
        el.position().top = 32// el.position().top - 1;
    }
    if (ev.keyCode === 39) {
        el.position().left = el.position().left + 1;
    }
    if (ev.keyCode === 40) {
        el.position().top = el.position().top + 1;
    }
});
$(document).keyup('.tooltipMan', function (ev) {
    return;
    var el = $('#' + global_var.current_us_input_id);
//    ev.preventDefault();
//    $(this).position().top = $(this).position().top - 1;
    console.log("keyup=", el.attr('id'), ' ; top=', el.position().top, '; LEFT=', el.position().left)

});
function hideModal(elementId) {
    $("#" + elementId).removeClass("in");
    $(".modal-backdrop").remove();
    $("#" + elementId).hide();
}

function clickCurrentInput() {
    $('#ipo_tr_' + global_var.current_us_input_id).click();
}

function hideToggleMain() {
    $('.main-toggle').hide()
}

function showToggleMain() {
    $('.main-toggle').show()
}

$(document).on('click', '.story-card-sprint-assign', function (evt) {
    global_var.story_card_sprint_assign_checked = 1;
    global_var.story_card_sprint_assign_name = $(this).attr('sname');
    global_var.story_card_sprint_assign_id = $(this).val();

    if (global_var.current_modal === "loadStoryCardMgmt") {
        new UserStory().setUSLists4KanbanView();
    } else if (global_var.current_modal === "loadTaskManagement") {
        $('.userStoryTab').click();
    } else if (global_var.current_modal === "loadBugChange") {
        getBugListDetails(coreBugList);
    } else {
        new UserStory().loadDetailesPure(SACore.toJSON());
    }
});


$(document).on('click', '.bug-task-sprint-assign', function (evt) {
    global_var.bug_task_sprint_assign_checked = 1;
    global_var.bug_task_sprint_assign_name = $(this).attr('sname');
    global_var.bug_task_sprint_assign_id = $(this).val();

    if (global_var.current_modal === "loadTaskManagement") {
        $('.' + global_var.task_mgmt_group_by).click();
    } else if (global_var.current_modal === "loadBugChange") {
        getBugListDetails(coreBugList);
    }
});


$(document).on('click', '.bug-task-label-assign', function (evt) {
    global_var.bug_task_label_assign_checked = 1;
    global_var.bug_task_label_assign_name = $(this).attr('sname');
    global_var.bug_task_label_assign_id = $(this).val();

    if (global_var.current_modal === "loadTaskManagement") {
        $('.' + global_var.task_mgmt_group_by).click();
    } else if (global_var.current_modal === "loadBugChange") {
        getBugListDetails(coreBugList);
    }
});

$(document).on('click', '.assign-split-story-card-item', function (evt) {
    var id = $(this).attr("pid");
    var sprintId = $(this).attr("sid");
    var checked = '0';
    if ($(this).is(":checked")) {
        checked = '1';
    }
    console.log(id, '->', checked, '->', sprintId);
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv['fkSprintId'] = sprintId;
    json.kv['fkProjectId'] = global_var.current_project_id;
    json.kv['fkBacklogId'] = id;
    json.kv.assign = checked;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAssignSprint",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SACore.updateBacklogByRes(res);
            new Sprint().load()
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
});

$(document).on('click', '.story-card-label-assign', function (evt) {
    global_var.story_card_label_assign_checked = 1;
    global_var.story_card_label_assign_name = $(this).attr('sname');
    global_var.story_card_label_assign_id = $(this).val();
    if (global_var.current_modal === "loadStoryCardMgmt") {
        new UserStory().setUSLists4KanbanView();
    } else if (global_var.current_modal === "loadTaskManagement") {
        $('.userStoryTab').click();
    } else {
        new UserStory().loadDetailesPure(SACore.toJSON());
    }
});
$(document).on('click', '.assign-label-story-card-item', function (evt) {
    var id = $(this).attr("pid");
    var labelId = $(this).attr("sid");
    var checked = '0';
    if ($(this).is(":checked")) {
        checked = '1';
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv['fkLabelId'] = labelId;
    json.kv['fkProjectId'] = global_var.current_project_id;
    json.kv['fkBacklogId'] = id;
    json.kv.assign = checked;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAssignLabel",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SACore.updateBacklogByRes(res);
            new Label().load()
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
});
function cloneTaskModal() {
    $('#cloneTaskModal').modal("show");
    SACore.FillInCombo('cloneTask_backlog_id');
}

function changeUserStoryOfTaskModal() {
    $('#change-user-story-task-modal').modal('show');


    if (global_var.current_modal === 'loadBugChange') {
        getBacklogListByProject();
    } else if (global_var.current_modal === 'loadTaskManagement') {
        SACore.FillInCombo('task-user-story-id-change');
    }


}

function showUserStoryOfTaskCardModal(el) {
    var backlogId = $(el).attr("pid");
    if (!backlogId) {
        return;
    }

//    $('.TaskStoryCardPanel').hide();
    $('#storyCardViewManualModal').modal('show');
    callStoryCard4BugTask('', backlogId, el);


//    var projectId = getProjectIdOfBacklog(backlogId);
//    if (projectId !== global_var.current_project_id) {
//        showProgressAlternative();
//        global_var.current_project_id = projectId;
//        new UserStory().refreshBacklog4Bug();
//    }
//    hideProgressAlternative();
//
//    showStoryCardIn(backlogId, "generalStatisticsDetailsModal-details");
}


function getBacklogListByProject(projectId) {
    $('#task-user-story-id-change').html('');
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetBacklogListByProjectId",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            try {
                var compId = 'task-user-story-id-change';
                $('#' + compId).html('');

                var obj = res.tbl[0].r;
                $('#' + compId).append($('<option>').val("-1").text("None"))
                for (var n = 0; n < obj.length; n++) {
                    var o = obj[n];
                    var id = o.id;
                    var name = o.backlogName + " (#" + o.orderNo + ") ";
                    $('#' + compId).append($('<option>').val(id).text(name))
                }

            } catch (err) {
            }
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function assignUserStorytoTask() {
    updateTask4ShortChangeDetails($('#task-user-story-id-change').val(), "fkBacklogId")
    $('#change-user-story-task-modal').modal('hide');
    $('#task-mgmt-modal-user-story')
            .attr('pid', $('#task-user-story-id-change').val())
            .html($('#task-user-story-id-change option:selected').text());
}



function assignBacklogTaskTo_template() {
    if (!$('#addNewDetailedTaskModal_projectid').val() || !$('#addNewDetailedTaskModal_description').val().trim()) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = $('#addNewDetailedTaskModal_projectid').val();
    json.kv.fkBacklogId = $('#addNewDetailedTaskModal_backlogid').val();
    json.kv.taskName = $('#addNewDetailedTaskModal_description').val();
    json.kv.taskNature = $('#addNewDetailedTaskModal_tasknature').val();
    json.kv.taskComment = $('#addNewDetailedTaskModal_comment').val();
    json.kv.assineeList = addNewDetailedTaskAction_assigneeList();
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddNewDetailedTaskAction",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#addNewDetailedTaskModal').modal('hide');
        }
    });
}


function assignBacklogTaskTo() {

    var assigneeList = assignBacklogTaskTo_assigneeList();

    if (!global_var.current_us_task_id || !assigneeList) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.taskComment = $('#assignTaskToOthersModal_comment').val();
    json.kv.taskId = global_var.current_us_task_id;
    json.kv.assigneeList = assigneeList;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAssignBacklogTaskTo",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
//            SATask.updateTaskByRes(res);
            $('#assignTaskToOthersModal_comment').val("");
            $('#assignTaskToOthersModal').modal("hide");
            getBugList();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function assignBacklogTaskTo_assigneeList() {
    var st = "";
    $('#assignTaskToOthersModal_assigneelist').find('.assignee-main-tr-4-assign').each(function () {
        var assigneeId = $(this).find('.assignee-td-4-assign').attr('pid');
        var tasktypeId = $(this).find('.tasktype-td-4-assign').attr('pid');
        tasktypeId = (tasktypeId) ? tasktypeId : "-1";
        st += assigneeId + ':' + tasktypeId + "|";
    })
    return st;
}


function cloneTask() {


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkBacklogId = $('#cloneTask_backlog_id').val();
    json.kv.id = global_var.current_us_task_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmCloneBacklogTask",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SATask.updateTaskByRes(res);
            getBugList();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}



function insertNewTask(el, taskStatus) {
    var taskName = $(el).parent().find(".TaskMiniStoryInput").val();
    var backlogId = global_var.task_mgmt_group_by === 'userStoryTab' ? $(el).attr('us-id') : "-1";
    var assgineeId = global_var.task_mgmt_group_by === 'assignee' ? $(el).attr('us-id') : "-1";
    this.insertNewTaskDetail(taskName, backlogId, assgineeId, taskStatus);
}

function insertNewTaskDetail(taskName, backlogId, assgineeId, taskStatus, projectId) {
    if (!(taskName))
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    projectId = (projectId) ? projectId : global_var.current_project_id;
    if (!projectId) {
        return;
    }

    backlogId = (backlogId) ? backlogId : "-1";
    assgineeId = (assgineeId) ? assgineeId : "-1";
    taskStatus = (taskStatus) ? taskStatus : "new";
    json.kv['fkProjectId'] = projectId;
    json.kv['fkBacklogId'] = backlogId;
    json.kv['fkAssigneeId'] = assgineeId;
    json.kv.taskName = taskName;
    json.kv.taskStatus = taskStatus;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogTask4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SATask.updateTaskByRes(res);
            SACore.updateBacklogByRes(res);
            genTaskKanbanView();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


function getTaskList() {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv['fkProjectId'] = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskList4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SATask.LoadTask(res);
        }
    });
}

function createBacklogKanbanDiv() {
    var keys = SACore.GetBacklogKeys();
    var r = {};
    for (var k in keys) {
        if (!k)
            continue;
        r[k] = {
            newDiv: [],
            ongoingDiv: [],
            closedDiv: []
        }
    }
    return r;
}

function genTaskKanbanViewTrigger() {
    $('.' + global_var.task_mgmt_group_by).click();
}

function genTaskKanbanView() {
    if (global_var.task_mgmt_group_by === 'none') {
        genTaskKanbanView4None();
        return;
    } else if (global_var.task_mgmt_group_by !== 'none') {
        genTaskKanbanView4Group();
        return;
    }
}

function genTaskKanbanView4Group() {
    $('#kanban_view_new_count').html(0);
    $('#kanban_view_ongoing_count').html(0);
    $('#kanban_view_closed_count').html(0);
    var bNoList = SATask.GetOrderNoKeys();
    var addedUS = [];
    var addedBacklogs = [];
    var newDiv = $('<div>')
    var ongoingDiv = $('<div>')
    var closedDiv = $('<div>')
    var r = {};
    $('.groupByUserstory').html('');
    try {
//            var obj = res.tbl[0].r;
        var c4new = 0;
        var c4ongoing = 0;
        var c4closed = 0;
        for (var n = 0; n < bNoList.length; n++) {
            var bid = SATask.OrderNo[bNoList[n]];
            var usIdList = bid.split(',');
            for (var k = 0; k < usIdList.length; k++) {
                var lastId = usIdList[k];
                if (lastId.length === 0 ||
                        jQuery.inArray(lastId, addedUS) !== -1) {
                    continue;
                }

                if (checkFilter4KanbanGroup(lastId)) {
                    continue;
                }

                if (!isTaskInSprint(lastId)) {
                    continue;
                }

                var obj = SATask.toJSONObject(lastId);
                var backlogId = global_var.task_mgmt_group_by === 'userStoryTab'
                        ? obj.fkBacklogId
                        : global_var.task_mgmt_group_by === 'assignee'
                        ? obj.fkAssigneeId
                        : "none";
                backlogId = (backlogId) ? backlogId : "-1";
                if (jQuery.inArray(backlogId, addedBacklogs) === -1) {
                    addedBacklogs.push(backlogId);
                    r[backlogId] = {
                        newDiv: $("<div>"),
                        ongoingDiv: $("<div>"),
                        closedDiv: $("<div>"),
                        count: 0,
                        bugCount: 0,
                        changeCount: 0,
                    }
                }



                var html = genUSLine4KanbanView(obj);
                if (obj.taskStatus === 'new') {
                    c4new++;
                    newDiv.append(html);
                    r[backlogId].newDiv.append(html);
                    r[backlogId].count++;
                    obj.taskNature === "bug" ? r[backlogId].bugCount++ : r[backlogId].bugCount;
                    obj.taskNature === "change" ? r[backlogId].changeCount++ : r[backlogId].bugCount;
                } else if (obj.taskStatus === 'ongoing') {
                    c4ongoing++;
                    ongoingDiv.append(html);
                    r[backlogId].ongoingDiv.append(html);
                    r[backlogId].count++;
                    obj.taskNature === "bug" ? r[backlogId].bugCount++ : r[backlogId].bugCount;
                    obj.taskNature === "change" ? r[backlogId].changeCount++ : r[backlogId].bugCount;
                } else if (obj.taskStatus === 'closed') {
                    c4closed++;
                    closedDiv.append(html);
                    r[backlogId].closedDiv.append(html);
                    r[backlogId].count++;
                    obj.taskNature === "bug" ? r[backlogId].bugCount++ : r[backlogId].bugCount;
                    obj.taskNature === "change" ? r[backlogId].changeCount++ : r[backlogId].bugCount;
                }

            }
            addedUS.push(lastId);
        }

        $('#kanban_view_new_count_4_task').html(c4new);
        $('#kanban_view_ongoing_count_4_task').html(c4ongoing);
        $('#kanban_view_closed_count_4_task').html(c4closed);
        if (c4new === 0) {
            newDiv.append($('<div class="task-content content-drag">'));
        }
        if (c4ongoing === 0) {
            ongoingDiv.append($('<div class="task-content content-drag">'));
        }
        if (c4closed === 0) {
            closedDiv.append($('<div class="task-content content-drag">'));
        }
    } catch (e) {
    }

    var bname0 = global_var.task_mgmt_group_by === 'userStoryTab'
            ? "Tasks without User Story"
            : global_var.task_mgmt_group_by === 'assignee'
            ? "Tasks without Assignee"
            : "none";
    try {
        var divUserStory = TaskCard.UserStory.Get(bname0, "", "-1", r["-1"].count, r["-1"].bugCount, r["-1"].changeCount, r["-1"].newDiv, r["-1"].ongoingDiv, r["-1"].closedDiv);
        $('.groupByUserstory').append(divUserStory);
    } catch (e) {

    }

    for (var l in r) {
        if (l === '-1')
            continue;
        var bname = global_var.task_mgmt_group_by === 'userStoryTab'
                ? SACore.GetBacklogname(l)
                : global_var.task_mgmt_group_by === 'assignee'
                ? SAProjectUser.GetUserDetails(l, "userPersonName")
                : "none";
        if (!bname) {
            bname = global_var.task_mgmt_group_by === 'userStoryTab'
                    ? "Tasks without User Story"
                    : global_var.task_mgmt_group_by === 'assignee'
                    ? "Tasks without Assignee"
                    : "";
        }


        var bstatus = SACore.GetBacklogKey(l, "backlogStatus");
        bstatus = (bstatus) ? bstatus : "";
        var divUserStory = TaskCard.UserStory.Get(bname, bstatus, l, r[l].count, r[l].bugCount, r[l].changeCount, r[l].newDiv, r[l].ongoingDiv, r[l].closedDiv);
        $('.groupByUserstory').append(divUserStory);
    }

//diger backloglar uchun daxil etmek
    global_var.task_mgmt_group_by_filled_list = r;
//    addRemainingUSOrTaskForKanbanViewGroup();

    global_var.story_card_sprint_assign_checked = 0;
    global_var.story_card_label_assign_checked = 0;
    contentArrangableUI();
}
function addNewDetailedTaskAction_assigneeList() {
    var st = "";
    $('#addNewDetailedTaskModal_assigneelist').find('.assignee-main-tr').each(function () {
        var assigneeId = $(this).find('.assignee-td').attr('pid');
        var tasktypeId = $(this).find('.tasktype-td').attr('pid');
        tasktypeId = (tasktypeId) ? tasktypeId : "-1";
        st += assigneeId + ':' + tasktypeId + "|";
    })
    return st;
}

function addNewDetailedTaskAction() {
    if (!$('#addNewDetailedTaskModal_projectid').val() || !$('#addNewDetailedTaskModal_description').val().trim()) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = $('#addNewDetailedTaskModal_projectid').val();
    json.kv.fkBacklogId = $('#addNewDetailedTaskModal_backlogid').val();
    json.kv.taskName = $('#addNewDetailedTaskModal_description').val();
    json.kv.taskNature = $('#addNewDetailedTaskModal_tasknature').val();
    json.kv.taskComment = $('#addNewDetailedTaskModal_comment').val();
    json.kv.assineeList = addNewDetailedTaskAction_assigneeList();
    json.kv.fileList = $('#addNewDetailedTaskModal_filelist').val();
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddNewDetailedTaskAction",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#addNewDetailedTaskModal').modal('hide');
        }
    });
}

function ForwardTaskTo() {
    $('#forwardTaskToModal').modal('show');
    ForwardTaskTo_loadAssignee();
}

function rejectTask() {
    $('#rejectTaskModal').modal('show');
}



function forwardTaskToAction() {
    updateTask4ShortChangeDetailsWithSync($('#forwardTaskToModal_assignee').val(), 'fkAssigneeId');

    if ($('#forwardTaskToModal_comment').val().trim()) {
        $('#addComment4Task_comment').val($('#forwardTaskToModal_comment').val());
        new UserStory().addCommentInput4Task('');
    }
//    this.refreshCurrentBacklog();
    $('#forwardTaskToModal_comment').val('');
    $('#forwardTaskToModal').modal('hide');
    $('.task-card-UserStory-edit-exit').click();
    getBugList();
}



function rejectTaskAction() {
    updateTask4ShortChangeDetailsWithSync('rejected', 'taskStatus');

    if ($('#rejectTaskModal_reason').val().trim()) {
        $('#addComment4Task_comment').val($('#rejectTaskModal_reason').val());
        new UserStory().addCommentInput4Task('');
    }
//    this.refreshCurrentBacklog();
    $('#rejectTaskModal_reason').val('');
    $('#rejectTaskModal').modal('hide');
    getBugList();
}




function ForwardTaskTo_loadAssignee() {
    var select = $('#forwardTaskToModal_assignee');
    select.html('');
    var keys = SAProjectUser.GetKeys();
    for (var i = 0; i < keys.length; i++) {
        var userName = SAProjectUser.GetDetails(keys[i], "userName");
        select.append($('<option>').val(keys[i]).text(userName));
    }
    sortSelectBox('forwardTaskToModal_assignee');
}

function addProceccDescListToTaskNew() {
    $('#addNewDetailedTaskModal').modal('show');
    addUserStoryToTask_loadAssignee();
    addUserStoryToTask_loadTaskType();
    $('#addNewDetailedTaskModal_assigneelist').html('');
    $('#addNewDetailedTaskModal_backlogid').val(global_var.current_backlog_id);
    $('#addNewDetailedTaskModal_projectid').val(global_var.current_project_id);
    addProceccDescListToTaskNew_setHeader();
    addProceccDescListToTaskNew_setComment();

}

function addProceccDescListToTaskNew_setHeader() {
    var inputList = addProceccDescListToTaskNew_getCheckedProcess();
    var st = "Update '" + add3Dots2String(inputList, 110) + "'";
    $('#addNewDetailedTaskModal_description').val(st);
}


function addProceccDescListToTaskNew_getCheckedProcess() {
    var st = "";
    $('.pdescList').each(function () {
        if ($(this).is(":checked")) {
            var name = $(this).closest('tr').find('.procDescTitleNewNowAfter').html();
            name = name.replaceAll('<br>', '')
            st += name + ", ";
        }
    })
    return st;
}


function addProceccDescListToTaskNew_setComment() {
    var st = "The following Process Description(s) should be Added or Updated. For the detailed information please check the related Story Card: \n\n"
            ;

    var idx = 1;
    $('.pdescList').each(function () {
        if ($(this).is(":checked")) {
            var id = $(this).val();



            var name = $(this).closest('tr').find('.procDescTitleNewNowAfter').html();
            name = name.replaceAll('<br>', '')
            st += (idx++) + ") " + name;
            st += "\n------------------------------------------------------------------------------------------\n";
        }
    })

    $('#addNewDetailedTaskModal_comment').val(st);
}

function addProceccDescListToTaskNew_getLastValue(descId) {
    var rs = "";
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkInputDescriptionId = descId;
    json.kv.asc = 'typeName';
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetInputDescHistoryBeforeLastChange",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            rs = res.kv.lastValue;
        }
    });
    return rs;
}

function assignTaskToOthers() {
    $('#assignTaskToOthersModal').modal('show');
    assignTaskToOthers_loadAssignee();
    addUserStoryToTask_loadTaskType();
    $('#assignTaskToOthersModal_assigneelist').html('');
    $('#assignTaskToOthersModal_backlogid').val(global_var.current_backlog_id);
    $('#assignTaskToOthersModal_projectid').val(global_var.current_project_id);
}



function addInputListToTaskNew(el, descId, inputId) {
    $('#addNewDetailedTaskModal').modal('show');
    addUserStoryToTask_loadAssignee();
    addUserStoryToTask_loadTaskType();
    $('#addNewDetailedTaskModal_assigneelist').html('');
    $('#addNewDetailedTaskModal_backlogid').val(global_var.current_backlog_id);
    $('#addNewDetailedTaskModal_projectid').val(global_var.current_project_id);
    addInputListToTaskNew_setHeader(descId);
    addInputListToTaskNew_setComment(descId, inputId);
}

function addInputListToTaskNew_setHeader() {
    var inputList = addInputListToTaskNew_getCheckedInputs();
    var st = "Add/Update Inputs - '" + add3Dots2String(inputList, 60) + "'";
    $('#addNewDetailedTaskModal_description').val(st);
}


function addInputListToTaskNew_getCheckedInputs() {
    var st = "";
    $('.us-input-list-item-check-box-class-new').each(function () {
        if ($(this).is(":checked")) {
            var name = SAInput.GetInputName($(this).val());
            st += name + ", ";
        }
    })
    return st;
}


function addInputListToTaskNew_setComment() {
    var st = "The following Input(s) should be Added or Updated. For the detailed information please check the related Story Card. \n\n"
            ;

    var idx = 1;
    $('.us-input-list-item-check-box-class-new').each(function () {
        if ($(this).is(":checked")) {
            var name = SAInput.GetInputName($(this).val());
            st += (idx++) + ") " + name + ": \n ";
            try {
                var descId = SAInput.getInputDetails($(this).val(), 'inputDescriptionIds').split(", ");
                for (var i in descId) {
                    var id = descId[i];
                    var desc = fnline2Text(SAInputDesc.GetDetails(id));
                    st += "- " + desc + '\n';
                }
            } catch (err) {
            }
            st += '\n';
        }
    })

    $('#addNewDetailedTaskModal_comment').val(st);
}


function addInputDescToTaskNew(el, descId, inputId) {
    $('#addNewDetailedTaskModal').modal('show');
    addUserStoryToTask_loadAssignee();
    addUserStoryToTask_loadTaskType();
    $('#addNewDetailedTaskModal_assigneelist').html('');
    $('#addNewDetailedTaskModal_backlogid').val(global_var.current_backlog_id);
    $('#addNewDetailedTaskModal_projectid').val(global_var.current_project_id);
    addInputDescToTaskNew_setHeader(descId);
    addInputDescToTaskNew_setComment(descId, inputId);

}

function addInputDescToTaskNew_setHeader(descId) {
    var inputDesc = SAInputDesc.GetDetails(descId);
    inputDesc = fnline2Text(inputDesc);
    inputDesc = Replace2Primes(inputDesc);
    inputDesc = replaceTags(inputDesc)
    var st = "Change in '" + add3Dots2String(inputDesc, 60) + "'";
    $('#addNewDetailedTaskModal_description').val(st);
}


function addInputDescToTaskNew_getLastValue(descId) {
    var rs = "";
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkInputDescriptionId = descId;
    json.kv.asc = 'typeName';
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetInputDescHistoryBeforeLastChange",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            rs = res.kv.lastValue;
        }
    });
    return rs;
}

function addInputDescToTaskNew_setComment(descId, inputId) {
    var backlogName = SACore.GetCurrentBacklogname();
    var inputDesc = SAInputDesc.GetDetails(descId);
    inputDesc = Replace2Primes(inputDesc);
    inputDesc = fnline2Text(inputDesc);
    inputDesc = replaceTags(inputDesc)

    var inputName = SAInput.GetInputName(inputId);
    inputName = Replace2Primes(inputName);
    inputName = fnline2Text(inputName);
    inputName = replaceTags(inputName)

    var asisMsg = addInputDescToTaskNew_getLastValue(descId);
    asisMsg = (asisMsg) ? "\n - " + asisMsg : "EMPTY";

    var st = "The following change(s) in the Input Description '" + inputDesc
            + "' of Input '" + inputName + "' should be implemented. For the detailed information please check the related Story Card."
            + "\n\n AS-IS: "
            + asisMsg
            + "\n\n"
            + "EXPECTED:\n"
            + " - " + inputDesc;
    $('#addNewDetailedTaskModal_comment').val(st);
}

function addUserStoryToTask() {
    $('#addNewDetailedTaskModal').modal('show');
    addUserStoryToTask_loadAssignee();
    addUserStoryToTask_loadTaskType();
    $('#addNewDetailedTaskModal_assigneelist').html('');
    $('#addNewDetailedTaskModal_backlogid').val(global_var.current_backlog_id);
    $('#addNewDetailedTaskModal_projectid').val(global_var.current_project_id);
    $('#addNewDetailedTaskModal_tasknature').val("new");
    addUserStoryToTask_setHeader();
    addUserStoryToTask_setComment();
//    var backlogId = global_var.current_backlog_id;
//    var taskName = SACore.GetCurrentBacklogname();
//    insertNewTaskDetail(taskName, backlogId, "", "");
//    Toaster.showMessage("'" + taskName + "' - Added to Task")
}

function addUserStoryToTask_setHeader() {
    var backlogName = SACore.GetCurrentBacklogname();
    var st = "Create a new Story Card called '" + replaceTags(backlogName) + "'";
    $('#addNewDetailedTaskModal_description').val(st);
}

function addUserStoryToTask_setComment() {
    var backlogName = SACore.GetCurrentBacklogname();
    var st = "Create a new form as given in a Story Card called '" + replaceTags(backlogName) + "'. "
            + " Please check the related Story Card for detailed information ";
    $('#addNewDetailedTaskModal_comment').val(st);
}


function assignTaskToOthersModal_addAssignees() {
    if (!$('#assignTaskToOthersModal_assignee').val()) {
        return;
    }

    var tbody = $('#assignTaskToOthersModal_assigneelist');
    tbody.append($('<tr>').addClass("assignee-main-tr-4-assign")
            .append($('<td>')
                    .addClass("assignee-td-4-assign")
                    .attr("pid", $('#assignTaskToOthersModal_assignee').val())
                    .text($('#assignTaskToOthersModal_assignee option:selected').text()))
            .append($('<td>')
                    .attr("pid", $('#assignTaskToOthersModal_tasktype').val())
                    .addClass('tasktype-td-4-assign')
                    .text($('#assignTaskToOthersModal_tasktype option:selected').text()))
            .append($('<i class="fa fa-trash">')
                    .attr("onclick", "assignTaskToOthersModal_removeAssignee(this)")
                    .attr("cursor", "pointer")
                    .css("color", "blue")
                    ))


}


function addUserStoryToTask_addAssignees() {
    if (!$('#addNewDetailedTaskModal_assignee').val()) {
        return;
    }

    var tbody = $('#addNewDetailedTaskModal_assigneelist');
    tbody.append($('<tr>').addClass("assignee-main-tr")
            .append($('<td>')
                    .addClass("assignee-td")
                    .attr("pid", $('#addNewDetailedTaskModal_assignee').val())
                    .text($('#addNewDetailedTaskModal_assignee option:selected').text()))
            .append($('<td>')
                    .attr("pid", $('#addNewDetailedTaskModal_tasktype').val())
                    .addClass('tasktype-td')
                    .text($('#addNewDetailedTaskModal_tasktype option:selected').text()))
            .append($('<i class="fa fa-trash">')
                    .attr("onclick", "addUserStoryToTask_removeAssignee(this)")
                    .attr("cursor", "pointer")
                    .css("color", "blue")
                    ))
}

function assignTaskToOthersModal_removeAssignee(el) {
    $(el).closest("tr").remove();
}

function addUserStoryToTask_removeAssignee(el) {
    $(el).closest("tr").remove();
}

function assignTaskToOthers_loadAssignee() {
    var select = $('#assignTaskToOthersModal_assignee');
    select.html('');
    var keys = SAProjectUser.GetKeys();
    select.append($('<option>').val('').text(''));
    for (var i = 0; i < keys.length; i++) {
        var userName = SAProjectUser.GetDetails(keys[i], "userName");
        select.append($('<option>').val(keys[i]).text(userName));
    }
    sortSelectBox('assignTaskToOthersModal_assignee');
}

function addUserStoryToTask_loadAssignee() {
    var select = $('#addNewDetailedTaskModal_assignee');
    select.html('');
    var keys = SAProjectUser.GetKeys();
    select.append($('<option>').val('').text(''));
    for (var i = 0; i < keys.length; i++) {
        var userName = SAProjectUser.GetDetails(keys[i], "userName");
        select.append($('<option>').val(keys[i]).text(userName));
    }
    sortSelectBox('addNewDetailedTaskModal_assignee');
}

function addUserStoryToTask_loadTaskType() {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.asc = 'typeName';
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskTypeList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            addUserStoryToTask_loadTaskTypeDetails(res);
        }
    });
}

function addUserStoryToTask_loadTaskTypeDetails(res) {
    var select = $('#addNewDetailedTaskModal_tasktype');
    var select2 = $('#assignTaskToOthersModal_tasktype');
    select.html("").append($('<option>').val("").append(" "));
    select2.html("").append($('<option>').val("").append(" "));

    var obj = res.tbl[0].r;
    for (var n = 0; n < obj.length; n++) {
        select.append($('<option>').val(obj[n].id).text(obj[n].typeName));
        select2.append($('<option>').val(obj[n].id).text(obj[n].typeName));
    }
    sortSelectBox('addNewDetailedTaskModal_tasktype');
    sortSelectBox('assignTaskToOthersModal_tasktype');
}


function editUserStoryName(el) {
    $('#generalview-us-header-name').dblclick();
}

function addProcessDescToTask(el, procesDescId) {
    var backlogId = global_var.current_backlog_id;
    var taskName = $(el).closest('tr').find('td.text-holder').first().attr('idesc');
    insertNewTaskDetail(taskName, backlogId, "", "");
    Toaster.showMessage("'" + taskName + "' - Added to Task")
}

function editBacklogDesc(el) {
    $(el).closest("tr").find('td.text-holder').first().dblclick();
}

function editInputName(el) {
    $(el).closest("tr").find('td[ondblclick]').first().dblclick();
}


function editInputDescription(el) {
    $(el).parent().parent().parent().find('span[ondblclick]').first().dblclick()
//console.log(    $(el).parent().parent().html() );
}


function addInputDescToTask(el, descId) {

}

function addInputDescToTaskDetailsNew(el, descId) {
    if (!descId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkInputDescriptionId = descId;
    var that = this;
    var data = JSON.stringify(json);
    var rs = "";
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddInputDescToTask",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SATask.updateTaskByRes(res);
            SACore.updateBacklogByRes(res);
            Toaster.showMessage("'" + SAInputDesc.GetDetails(descId, ) + "' - Added to Task")
//            rs = generateCommentListHtml4Task(res, taskId);
        },
        error: function () {
//                Toaster.showError("error");
        }
    });
}

function checkFilter4KanbanGroup(lastId) {
    var res = false;
    var obj = SATask.toJSONObject(lastId);
    //check the filter task
    var hasTaskFilterRes = false;
    try {
        if (hasFilter4Task() && SATask.checkFilter(obj)) {
            hasTaskFilterRes = true;
        } else {
            hasTaskFilterRes = false;
        }
    } catch (e) {
    }

//check the filter user story
    var hasUserStoryFilterRes = false;
    try {
//                    if (global_var.task_mgmt_group_by === 'userStoryTab') {
        if (hasFilter4UserStory() && (obj.fkBacklogId === '-1' || !obj.fkBacklogId)) {
            hasUserStoryFilterRes = true;
        } else {
            hasUserStoryFilterRes = false;
        }

        var objUS = SACore.toJSONObject(obj.fkBacklogId);
        if (hasFilter4UserStory() && SACore.checkFilterUserStory(objUS)) {
            hasUserStoryFilterRes = true;
        } else {
            hasUserStoryFilterRes = false;
        }
//                    }
    } catch (e) {
    }


    if (hasFilter4Task() && hasUserStoryFilterRes === true
            && hasFilter4UserStory() && hasTaskFilterRes === true) {
        res = true;
    } else if (hasFilter4Task() === false && hasFilter4UserStory() && hasUserStoryFilterRes === true) {
        res = true;
    } else if (hasFilter4Task() && hasTaskFilterRes === true) {
        res = true;
    }
    return res;
}

function addRemainingUSOrTaskForKanbanViewGroup() {
    var r = global_var.task_mgmt_group_by_filled_list;
    var keys = global_var.task_mgmt_group_by === 'userStoryTab'
            ? SACore.GetBacklogKeys()
            : global_var.task_mgmt_group_by === 'assignee'
            ? SAProjectUser.GetKeys()
            : [];
    for (var tk in keys) {
        var l = keys[tk];
        var objTask = SATask.toJSONObject(l);
        if (hasFilter4Task() && SATask.checkFilter(objTask)) {
            continue;
        }

        try {
            if (global_var.task_mgmt_group_by === 'userStoryTab') {
                var objUS = SACore.toJSONObject(l);
                if (SACore.checkFilterUserStory(objUS)) {
                    continue;
                }
            }
        } catch (e) {
        }
        var tkeys = Object.keys(r);
        if (l === '-1' || !l || jQuery.inArray(l, tkeys) !== -1)
            continue;
//        try {
        var bname = global_var.task_mgmt_group_by === 'userStoryTab'
                ? SACore.GetBacklogname(l)
                : global_var.task_mgmt_group_by === 'assignee'
                ? SAProjectUser.GetUserDetails(l, "userPersonName")
                : "none";
        if (!bname) {
            bname = global_var.task_mgmt_group_by === 'userStoryTab'
                    ? "Tasks without User Story"
                    : global_var.task_mgmt_group_by === 'assignee'
                    ? "Tasks without Assignee"
                    : "";
        }


        var bstatus = SACore.GetBacklogKey(l, "backlogStatus");
        bstatus = (bstatus) ? bstatus : "";
        var divUserStory = TaskCard.UserStory.Get(bname, bstatus, l, 0, 0, 0, $('<div>'), $('<div>'), $('<div>'));
        $('.groupByUserstory').append(divUserStory);
//        } catch (e) {
//        }
    }
}

function isTaskInSprint(taskId) {
    var res = false;
    var ff = true;

    $('.bug-task-filter-checkbox-sprint').each(function () {
        if ($(this).is(':checked')) {
            ff = false;
            var taskIds = $(this).attr("taskids");
            if (taskIds.includes(taskId)) {
                res = true;
            }
        }
    })
    if (ff) {
        res = true;
    }
    return res;
}

function genTaskKanbanView4None() {
    $('#kanban_view_new_count').html(0);
    $('#kanban_view_ongoing_count').html(0);
    $('#kanban_view_closed_count').html(0);
    $('.task-kanban-view-new').html('');
    $('.task-kanban-view-ongoing').html('');
    $('.task-kanban-view-closed').html('');
    var bNoList = SATask.GetOrderNoKeys();
    var addedUS = [];
    try {
//            var obj = res.tbl[0].r;
        var c4new = 0;
        var c4ongoing = 0;
        var c4closed = 0;
        for (var n = 0; n < bNoList.length; n++) {
            var bid = SATask.OrderNo[bNoList[n]];
            var usIdList = bid.split(',');
            for (var k = 0; k < usIdList.length; k++) {
                var lastId = usIdList[k];
                if (lastId.length === 0 ||
                        jQuery.inArray(lastId, addedUS) !== -1) {
                    continue;
                }

                var obj = SATask.toJSONObject(lastId);
                if (checkFilter4KanbanGroup(lastId)) {
                    continue;
                }

                if (!isTaskInSprint(lastId)) {
                    continue;
                }
//                if (hasFilter4Task() && SATask.checkFilter(obj)) {
//                    continue;
//                }

                var html = genUSLine4KanbanView(obj);
                if (obj.taskStatus === 'new') {
                    c4new++;
                    $('.task-kanban-view-new').append(html);
                } else if (obj.taskStatus === 'ongoing') {
                    c4ongoing++;
                    $('.task-kanban-view-ongoing').append(html);
                } else if (obj.taskStatus === 'closed') {
                    c4closed++;
                    $('.task-kanban-view-closed').append(html);
                }
                $('#kanban_view_new_count_4_task').html(c4new);
                $('#kanban_view_ongoing_count_4_task').html(c4ongoing);
                $('#kanban_view_closed_count_4_task').html(c4closed);
            }
            addedUS.push(lastId);
        }


        if (c4new === 0) {
            $('.task-kanban-view-new')
                    .append($('<div class="task-content content-drag">'));
        }
        if (c4ongoing === 0) {
            $('.task-kanban-view-ongoing')
                    .append($('<div class="task-content content-drag">'));
        }
        if (c4closed === 0) {
            $('.task-kanban-view-closed')
                    .append($('<div class="task-content content-drag">'));
        }
    } catch (e) {
    }
    global_var.story_card_sprint_assign_checked = 0;
    global_var.story_card_label_assign_checked = 0;

    global_var.bug_task_sprint_assign_checked = '';
    global_var.bug_task_sprint_assign_name = '';
    global_var.bug_task_sprint_assign_id = '';

    contentArrangableUI();
}

function getSprintTaskCheckedCount() {
    var res = 0;
    $('.bug-task-filter-checkbox-sprint').each(function () {
        if ($(this).is(":checked")) {
            res++;
        }
    })
    return res;
}

function genUSLine4KanbanView(o) {

    var ischecked = (getSprintTaskCheckedCount() > 0);
    var div = $('<div>')
            .append($("<input type='checkbox'>")
                    .addClass("assign-sprint-to-task-item")
                    .attr("pid", o.id)
                    .attr('projectId', o.fkProjectId)
                    .attr('backlogId', o.fkBacklogId)
                    .attr("checked", ischecked)
                    .attr("sid", global_var.bug_task_sprint_assign_id))
            .append($('<span>').append(" (" + global_var.bug_task_sprint_assign_name + ") "));

    var rs = global_var.bug_task_sprint_assign_checked === 1
            ? div.html() + " "
            : "";



    var assigneeImg = $('<span>')
    if (o.fkAssigneeId.length > 3) {
        var userImage = SAProjectUser.GetDetails(o.fkAssigneeId, "userImage");
        var userName = SAProjectUser.GetDetails(o.fkAssigneeId, "userName");
        var img = (userImage)
                ? fileUrl(userImage)
                : fileUrl(new User().getDefaultUserprofileName());
        assigneeImg.append($('<img>')
//                        .css("width","24px")
//                        .css('height','24px')
                .addClass('Assigne-card-story-select-img')
                .attr('src', img)
                .attr('alt', userName)
                .attr("title", userName))
    }

    var taskImage = (o.lastImage)
            ? "<img src='" + fileUrl(o.lastImage) + "' style='max-height:150px;width:100%'>"
            : "";
    var taskName = (o.taskName) ? rs + replaceTags(o.taskName) : rs + " No Title ";
    var taskNature = o.taskNature === 'bug'
            ? $('<i class="fa fa-bug" aria-hidden="true"></i>')
            .css('color', "red")
            .attr("title", " Bug")
            .css("font-size", "11px")
            : o.taskNature === 'change'
            ? $('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>')
            .css("color", "orange")
            .css("font-size", "11px")
            .attr("title", " Change Request")
            : "";
    var taskVersion = ""
    try {
        taskVersion = (o.taskVersion)
                ? $('<a class="ContentTextWithVersion">')
                .attr('href', '#')
                .attr('labelId', o.taskVersion)
                .attr("backlogId", o.fkBacklogId)
                .css("font-size", "12px")
                .css("color", "rgb(170, 170, 170)")
                .append('User Story Version')
                .append('<br>')
                : "";
    } catch (e) {
    }

    var userStory = (o.fkBacklogId.length > 0 && o.fkBacklogId !== '-1')
            ? $('<a class="ContentTextWithVersion">')
            .attr('href', '#')
            .css("font-size", "12px")
            .css("color", "rgb(170, 170, 170)")
            .attr("onclick", "callStoryCard('" + o.fkBacklogId + "')")
            .append('#' + replaceTags(SACore.GetBacklogOrderNo(o.fkBacklogId) + ' '))
            .append(replaceTags(SACore.GetBacklogname(o.fkBacklogId)))
            .append('<br>')
            : "";
    var rs = "";
    var s = $('<div >')
            .addClass('task-content content-drag')
            .append($('<div class="task-content-header">')
                    .append($('<div class="TaskContentText">')
                            .attr('bno', o.taskOrderNo)
                            .attr('pid', o.id)
                            .append(rs)
                            .append(taskImage)
                            .append($('<span class="headerContentText">')
                                    .attr('href', '#')
                                    .attr('onclick1', "new UserStory().redirectToDetailedView('" + o.id + "')")
                                    .append('' + taskName))
                            .append("<br>")
                            .append(userStory)
                            )
                    )
            .append($('<div clas="taskContentBody">')
                    .append(taskVersion)
                    .append($('<span class="backlog-status">')
                            .append($('<div class="us-list-item">')
                                    .addClass('us-item-status-' + o.taskStatus)
                                    .append(o.taskStatus)
                                    ))

                    .append($('<span class="backlog-status">')
                            .append($('<div class="us-list-item us-item-date">')
                                    .append("&nbsp;" + getTaskCode(o.id))
                                    ))
                    .append($('<span class="backlog-status">')
                            .append($('<div class="us-list-item us-item-date">')
                                    .append("&nbsp;" + Utility.convertDate(o.createdDate))
                                    ))
                    .append($('<span class="backlog-status">')
                            .append("&nbsp;&nbsp;")
                            .append(taskNature))
                    .append($('<span class="backlog-status">')
                            .append("&nbsp;&nbsp;")
                            .append(assigneeImg))

                    )

    return s;
}

function  updateTask4ShortChangeTaskName() {
    updateTask4ShortChangeDetails($('.card-UserStory-header-input').val(), "taskName");
}


function deleteTask() {
    new UserStory().deleteBacklogTask(global_var.current_us_task_id);
}

function deleteComment(commentId) {


//        console.log('task id'+taskId);
    if (!commentId) {
        return;
    }

    if (!confirm("Are you sure?")) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = commentId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteComment",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            genCommentListOfTask();
        }
    });
}

function convertCommentHtml2TextArea(el, commentId) {
    new UserStory().convertCommentHtml2TextAreaNoChange($('#' + commentId));
    $(el).closest("div").find('.saveComment').show();
}

function saveComment(el, commentId) {
    new UserStory().saveCommentUpdate($('#' + commentId));
    new UserStory().convertTextArea2HtmlAsText($('#' + commentId));
    $(el).hide();
}

function genCommentListOfTask() {
    var taskId = global_var.current_us_task_id;
//        console.log('task id'+taskId);
    if (!taskId) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkTaskId = taskId;
    var that = this;
    var data = JSON.stringify(json);
    var rs = "";
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetCommentListByTask",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            rs = generateCommentListHtml4Task(res, taskId);
        },
        error: function () {
//                Toaster.showError("error");
        }
    });
    return rs;
}

function   generateCommentListHtml4Task(res, taskId) {
    try {
        if (!res.tbl[0].r) {
            return;
        }
        var obj = res.tbl[0].r;
        var div = $('<div></div>').append($('<div></div>').addClass("row").append("<br>"));
        for (var i = 0; i < obj.length; i++) {


            var div_by_col = $('<div></div>').addClass("col").addClass("mangodbcol1")
                    .append("<br>");
            var div_by_row = $('<div></div>')
                    .addClass("row")
                    .addClass("mangodb");
            var img = obj[i].avatarUrl.length === 0
                    ? fileUrl(new User().getDefaultUserprofileName())
                    : fileUrl(obj[i].avatarUrl);
            var div1 = $('<div></div>')
                    .addClass("col-1 comment-line1")
                    .append($('<img></img>')
                            .addClass("figure-img img-fluid rounded-circle")
                            .attr("style", "max-width:28px")
                            .attr("src", img)
                            .attr("alt", replaceTags(obj[i].username)))
                    ;
//            var comment = replaceMainTrustedTags(replaceTags(obj[i].comment));
            var comment = replaceTags(obj[i].comment);
            var div2 = $('<div></div>')
                    .attr('style', "padding-left:0px;font-size:13px;")
                    .addClass("col-11")
                    .append($("<span>").append(obj[i].username)
                            .addClass('comment-content-header-name')
                            .append($("<span>")
                                    .addClass('comment-content-header-history')
                                    .append(Utility.convertDate(obj[i].commentDate))
                                    .append(", ")
                                    .append(Utility.convertTime(obj[i].commentTime))
                                    .append(" ")
                                    )
                            .append('&nbsp;&nbsp;&nbsp;')

                            .append($('<a href="#" style="font-size:11px;">')
                                    .addClass('comment-content-header-name')
                                    .attr('onclick', "deleteComment('" + obj[i].id + "')")
                                    .append("Delete"))
                            )
                    .append("<br><br>")
                    .append($("<span>")
                            .css('padding-bottom', "5px")
                            .attr("id", obj[i].id)
                            .attr("ondblclick", "new UserStory().convertCommentHtml2TextArea(this)")
                            .attr("pval", replaceMainTrustedTags(replaceTags(obj[i].comment)))
                            .append(MapTextAreaHtml(comment)))
                    ;
            var div2_1 = new UserStory().generateCommentFileLine(obj[i].fileName);
            var div3 = $('<div></div>').addClass("col-12").append("");
            div2.append(div2_1)
                    .append("<br>")
//                    .append($('<a href="#" style="font-size:11px;">')
//                            .attr('onclick', " convertCommentHtml2TextArea(this,'" + obj[i].id + "')")
//                            .append("Edit"))

//                    .append('&nbsp;&nbsp;&nbsp;')
//                    .append($('<a class="saveComment" href="#" style="display:none;font-size:11px;">')
//                            .attr('onclick', "saveComment(this,'" + obj[i].id + "')")
//                            .append("Save"));
            div_by_row.append(div1).append(div2)
                    .append(div3);
            div_by_col.append(div_by_row)
            div.append(div_by_col);
//                        div.append(div1).append(div2).append(div3);
        }
//        return div.html();

        $('.comment-body').html(div.html());
    } catch (e) {
    }
}


var TaskCard = {
    UserStory: {
        Get: function (userStoryName, userStoryStatus, userStoryId, taskCount, bugCount, changeCount, newList, ongoingList, closedList) {
            return $('<div class="UserStory">')
                    .append(this.UserStoryHeader(userStoryName, userStoryStatus, userStoryId, taskCount, bugCount, changeCount))
                    .append(this.TaskColumn.Get('new', newList, userStoryId))
                    .append(this.TaskColumn.Get('ongoing', ongoingList, userStoryId))
                    .append(this.TaskColumn.Get('closed', closedList, userStoryId))

        },
        UserStoryHeader: function (userStoryName, userStoryStatus, userStoryId, taskCount, bugCount, changeCount, ) {
            return $('<div class="userStory-header sticky-top1 col-12">')
                    .append($('<div class="downUser angle-right">')
                            .css("display", "none")
                            .append($('<i class="fas fa-angle-right"></i>')))
                    .append($('<div class="downUser angle-down">')
                            .append($('<i class="fas fa-angle-down"></i>')))

                    .append($('<span  style="margin-right: 10px;">')
                            .css("cursor", "pointer")
                            .css("color", "rgb(94, 108, 132)")
                            .append(this.GetAssignedLabelAndSprint(userStoryId))
                            .append(userStoryName)
                            .addClass("ContentTextTaskMgmt")
                            .attr("pid", userStoryId)
                            )
                    .append($('<span class="backlog-status">')
                            .append($('<div  class="us-list-item">')
                                    .addClass('us-item-status-' + userStoryStatus)
                                    .append(userStoryStatus))
                            )
                    .append($('<span>')
                            .css("color", "rgb(170, 170, 170)")
                            .css("font-size", "13px")
                            .append("&nbsp;&nbsp; " + taskCount)
                            .append(" task")
                            .append(taskCount > 1 ? "(s)" : "")
                            .append("&nbsp;&nbsp; " + bugCount)
                            .append(" bug")
                            .append(bugCount > 1 ? "(s)" : "")
                            .append("&nbsp;&nbsp; " + changeCount)
                            .append(" change request")
                            .append(changeCount > 1 ? "(s)" : "")
                            )
        },
        GetAssignedLabelAndSprint: function (id) {
            if (!id) {
                return "";
            }
            var ischecked = (global_var.userStoryFilter.sprint.length > 1);
            var div = $('<div>')
                    .append($("<input type='checkbox'>")
                            .addClass("assign-split-story-card-item")
                            .attr("pid", id)
                            .attr("checked", ischecked)
                            .attr("sid", global_var.story_card_sprint_assign_id))
                    .append($('<span>').append(" (" + global_var.story_card_sprint_assign_name + ") "));
            var ischecked4Lbl = (global_var.userStoryFilter.label.length > 1);
            var divLabel = $('<div>')
                    .append($("<input type='checkbox'>")
                            .addClass("assign-label-story-card-item")
                            .attr("pid", id)
                            .attr("checked", ischecked4Lbl)
                            .attr("sid", global_var.story_card_label_assign_id))
                    .append($('<span>').append(" (" + global_var.story_card_label_assign_name + ") "));
            var rs = global_var.story_card_sprint_assign_checked === 1
                    ? div.html()
                    : global_var.story_card_label_assign_checked === 1
                    ? divLabel.html() : "";
            return rs;
        },
        TaskColumn: {
            Get: function (action, cardList, usId) {
                return $('<div>')
                        .addClass("task-column")
                        .addClass(action)
                        .attr("us-id", usId)
                        .attr("status", action)
                        .append(this.TaskColumnBody(action, cardList))
                        .append(this.NewTaskCard(action, usId))
                        .append(this.PlusSign())
            },
            PlusSign: function () {
                return $('<div class="CardContentAdd">')
                        .append($('<img class="contentAdImg" src="resource/img/plus-icon.png" alt="">'))
            },
            NewTaskCard: function (action, userStoryId) {
                return $('<div class="TaskMiniStoryCard">')
                        .append($('<h5>').append("New Task"))
                        .append($('<input class="TaskMiniStoryInput form-control" type="text">'))
                        .append($('<div class="TextHeader " id="TaskAcceptStory">')
                                .attr('onclick', "insertNewTask(this, '" + action + "')")
                                .attr('us-id', userStoryId)
                                .css("color", "green")
                                .append($('<i class="fas fa-check" ></i>'))
                                )
                        .append($('<div class="TextHeader " id="DeleteStory">')
                                .css("color", "red")
                                .append($('<i class="fas fa-times" ></i>'))
                                )

            },
            TaskColumnBody: function (action, cardList) {
                return  $('<div class="task-column-body" id="new">')
                        .addClass("task_group_kanban_view_" + action)
                        .append($('<div draggable="true" class="content-drag">'))
                        .append(cardList.html())

            }
        }
    },
}

var EntityBlock = {
    Data: {},
    Get: function (data) {
        this.Data = data;
        //title
        //rows

    },
    Title: function () {
        ///type code here 
        this.Data;
    },
    Rows: function () {
        ///signle row
        this.Data;
    },
    SingleRow: function () {
        this.Data;
    }
}

var StoryCard = {
    BacklogId: "",
    Get: function (backlogId, noAttach) {
        noAttach = (noAttach) ? noAttach : true;
        this.BacklogId = backlogId;
        var divAttached = "";
        if (noAttach === true) {
            divAttached = this.FileList();
        }
        var body = $("<div>")
                .append(this.Header())
                .append(divAttached)
                .append(this.PinnedImage())
                .append(this.MockUp())
                .append(this.InputTable())
                .append(this.ProcessDescription())



        return body;
    },
    Header: function () {
        return $('<h4>')
                .css("padding", "20px 0px")
                .append(replaceTags(SACore.GetBacklogname(this.BacklogId)))
    },
    InputTable: function () {
        var div = $("<div class='row'>")

        var res = SAInput.toJSONByBacklog(this.BacklogId);
        var ind = 0;
        var table = "";
        try {
            table = new UserStory().getInputTable4StoryCard4SelectNew(res, ind, 0, '', '');
            table.find('.pdfHide,.td-with-input-checkbox').each(function () {
                $(this).remove();
            });
            table.find('.span_hover, .description-left').each(function () {
                $(this).removeAttr("ondblclick");
            });
            table.find(".sub_table").each(function () {
                $(this).show();
            });
            if (table) {
                div.append($('<div class="col-12 text-left">')
                        .css("padding", " 20px 0px 30px 30px")
                        .append($('<h6>').append("Input Description List")))

                div.append($('<div class="col-12 text-left">').append(table));
            }
        } catch (err) {

        }

        return div;
    },
    FileList: function () {
        var res = SACore.GetBaklogFileUrls(this.BacklogId).split(",");
        var resId = SACore.GetBaklogFileUrlIds(this.BacklogId).split(",");
        var div = $('<div class="row">');
        var f = true;
        for (var i = 0; i < res.length; i++) {

            try {
                if (f && (resId[i].trim())) {
                    div.css("padding", " 0px 0px 30px 30px");
                    f = false;
                }
                div.append(this.FileListIcons(resId[i].trim(), res[i].trim(), "col-4"));
            } catch (e) {
            }
        }
        return div;
    },
    PinnedImage: function () {
        var res = SACore.GetBaklogFileUrls(this.BacklogId).split(",");
        var resId = SACore.GetBaklogFileUrlIds(this.BacklogId).split(",");
        var div = $('<div class="row text-center">');
        var f = true;
        for (var i = 0; i < res.length; i++) {

            try {
                var id = resId[i].trim();
                var name = res[i].trim();
                var isPinned = SACore.IsImagePinned(id) ? true : false;
                if (f && (id)) {
                    div.css("padding", " 0px 0px 30px 30px");
                    f = false;
                }

                var div4PinnedImage = $('<div>');
                if (isPinned) {
                    div4PinnedImage.append($('<img></img>')
                            .attr('src', fileUrl(name))
//                            .addClass("pinned-image")
                            .css("width", "100%")
                            .css("padding-bottom", "20px")
                            .attr('alt', name));
                    div.append(div4PinnedImage);
                }

            } catch (e) {
            }
        }
        return div;
    },
    MockUp: function () {
        if (SACore.GetBacklogDetails(this.BacklogId, 'showPrototype') !== '1') {
            return "";
        }
        var div = $('<div class="row ">')
                .css("padding", " 0px 0px 30px 30px");
        try {
            var gui = new UserStory().getGUIDesignHTMLBody(SAInput.toJSONByBacklog(this.BacklogId), 0);
            if (gui) {
                div.append($('<div class="col-12 text-left">')
                        .css("padding", " 20px 0px 30px 30px")
                        .append($('<h6>').append("Prototype")))

                var divGUI = $("<div>")
                        .addClass(" col-12 redirectClass4CSS gv-gui-design")
                        .attr('style', "background: white;border-color: #F4F5F7; border-style: solid; border-radius: 4px;" +
                                Component.ReplaceCSS(SACore.GetBacklogParam1(this.BacklogId)))
                        .append(gui);
                div.append(divGUI);
            }
        } catch (err) {
        }

        return div;
    },
    ProcessDescription: function () {
        var div = $('<div class="row ">')
                .css("padding", " 0px 0px 30px 30px");
        try {
            var desc = this.ProcessDescriptionbody();
            if (desc) {
                div.append($('<div class="col-12 text-left">')
                        .css("padding", " 20px 0px 30px 30px")
                        .append($('<h6>').append("Process Description")))

                var divGUI = $("<div class='col-12'>")
                        .append(desc);
                div.append(divGUI);
            }
        } catch (err) {
        }

        return div;
    },
    ProcessDescriptionbody: function () {
        if (this.BacklogId.trim().length === 0) {
            return '';
        }

        var r = '';
        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.fkBacklogId = this.BacklogId;
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmGetBacklogDescriptionList",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: false,
            success: function (res) {
                try {
                    r = that.ProcessDescriptionDetails(res);
//                    return r;
                } catch (err) {
                    console.log(err)
                }
            }
        });
        return r;
    },
    ProcessDescriptionDetails: function (res) {
        var table = $('<table>')
                .addClass('table table-hover project-table-list defaultTable sar-table');
        table.append($('<thead>')
                .append($("<tr>")
                        .append($("<th>")
                                .css("width", "1%"))
                        .append($('<th>')
                                .append(""))))

        var obj = res.tbl[0].r;
        for (var n = 0; n < obj.length; n++) {
            var tr = $("<tr>")
                    .append($('<td>').append((n + 1)))
                    .append($('<td>')
                            .addClass('text-holder')
                            .append($('<span>')
                                    .css("border", obj[n].coloredType ? "3px solid " + replaceTags(obj[n].coloredType) : "")
                                    .css("background-color", obj[n].coloredType ? replaceTags(obj[n].coloredType) : "")
                                    .css("border-radius", "5px")
                                    .append(MapTextAreaHtml(replaceTags(obj[n].description)))));
            table.append(tr);
        }
        return table;
    },
    FileListIcons: function (id, name, cell) {

        try {
            cell = (cell === 'undefined' || !cell) ? 'col-6' : cell;
            var div = $('<div></div>');
            if (name.trim().length === 0) {
                return;
            }

            var ind = name.lastIndexOf(".") + 1;
            var fileFormat = name.substr(ind);
            var fileUrlVar = fileUrl(name);
            var div2 = $('<div></div>').addClass(cell);
            var div12lik = $('<div></div>').addClass("col-12").addClass('file_upload_div');
            if (global_var.image_formats.includes(fileFormat)) {
                div12lik.append($('<img></img>')
                        .attr('src', fileUrl(name))
                        .addClass('comment_img')
                        .attr('data-toggle', "modal")
                        .attr('data-target', "#commentFileImageViewer")
                        .attr('onclick', 'new UserStory().setCommentFileImageViewerUrl("' + name + '")')
                        .attr('alt', name));
//                    
            } else if (global_var.video_formats.includes(fileFormat)) {
                fileUrlVar = videoFileURL(name);
                div12lik.append($('<a target="_blank"></a>')
                        .attr("href", videoFileURL(name))
                        .append($('<img></img>')
                                .attr('src', fileUrlPrivate('video_player_logo.jpg'))
                                .addClass('comment_img')
                                .attr('alt', name)));
//                    
            } else if (fileFormat === 'pdf') {
                fileUrlVar = pdfFileURL(name);
                div12lik.append(
                        $('<a target="_blank"></a>')
                        .attr("href", pdfFileURL(name))
                        .append($('<img></img>')
                                .attr('src', fileUrlPrivate('pdf-logo.png'))
                                .addClass('comment_img')
                                .attr('alt', name)));
            }
            div12lik.append(' <b> ' + add3Dots2Filename(name) + '</b><br>');
            div12lik.append($('<a target="_blank"></a>')
                    .attr("href", fileUrlVar)
                    .append($('<i class="fa fa-download"></i>')))
                    ;
            div2.append(div12lik);
            div.append(div2);
            var div_col = $('<div></div>').addClass("col").attr("style", "padding:0px;");
            div_col.append(div);
            return div.html();
        } catch (err) {
        }
    },
}


var SourcedActivityDiagram = {
    FilterPool: {
        APIRightColumnCount: 1,
        StoryCardColumnCount: 1,
        ShowAPICards: true,
        ShowEntityCards: true,
        ShowOnlyActiveStoryCards: false,
        ShowStoryCards: true,
        ShowCardDetails: false,
        ShowScreens: false,
    },
    SelectedStoryCardByFiler: [],
    UsedLeftEntity: [],
    UsedRightEntity: [],
    UsedBacklogs: [],
    UsedLeftApisInner: [],
    UsedLeftApisCore: [],
    UsedLeftApisCore4Select: [],
    UsedRightApisCore: [],
    UsedRightApisCore4Select: [],
    UsedRightApisInner: [],
    LineList: [],
    Filter: {
        SetAPIRightColumnCount: function (el) {
            SourcedActivityDiagram.FilterPool.APIRightColumnCount = $(el).val();
            SourcedActivityDiagram.ToggleSetAPIRightColumn();
            SourcedActivityDiagram.Init();
        },
        SetStoryCardColumnCount: function (el) {
            SourcedActivityDiagram.FilterPool.StoryCardColumnCount = $(el).val();
            SourcedActivityDiagram.ToggleSetStoryCardColumn();
            SourcedActivityDiagram.Init();
        },
        ToggleAPICards: function (el) {
            var val = true;
            if (!$(el).is(":checked")) {
                val = false;
            }

            SourcedActivityDiagram.FilterPool.ShowAPICards = val;
            SourcedActivityDiagram.Init();
        },
        ToggleStoryCards: function (el) {
            var val = true;
            if (!$(el).is(":checked")) {
                val = false;
            }

            SourcedActivityDiagram.FilterPool.ShowStoryCards = val;
            SourcedActivityDiagram.Init();
        },
        ToggleCardDetails: function (el) {
            var val = false;
            if ($(el).is(":checked")) {
                val = true;
            }

            SourcedActivityDiagram.FilterPool.ShowCardDetails = val;
            SourcedActivityDiagram.Init();
        },
        ToggleEntityCards: function (el) {
            var val = true;
            if (!$(el).is(":checked")) {
                val = false;
            }

            SourcedActivityDiagram.FilterPool.ShowEntityCards = val;
            SourcedActivityDiagram.Init();
        },
        ToggleOnlyActiveStoryCards: function (el) {
            var val = true;
            if (!$(el).is(":checked")) {
                val = false;
            }

            SourcedActivityDiagram.FilterPool.ShowOnlyActiveStoryCards = val;
            SourcedActivityDiagram.Init();
        },
        ToggleShowScreens: function (el) {
            var val = true;
            if (!$(el).is(":checked")) {
                val = false;
            }

            SourcedActivityDiagram.FilterPool.ShowScreens = val;
            SourcedActivityDiagram.Init();
        }
    },
    ToggleSetAPIRightColumn: function () {
        $('.sadiagram-apiright-general').hide();
        var rc = this.FilterPool.APIRightColumnCount;
        for (var i = 1; i <= rc; i++) {
            $('.sadiagram-apiright-' + i).show();
        }
    },
    ToggleSetStoryCardColumn: function () {
        $('.sadiagram-story-card-general').hide();
        var rc = this.FilterPool.StoryCardColumnCount;
        for (var i = 1; i <= rc; i++) {
            $('.sadiagram-story-card-' + i).show();
        }
    },
    ShowOnlySCInList: function (storyCardList) {
        this.SelectedStoryCardByFiler = storyCardList;
        this.GetSendToSelectedList();
        this.Init();
        if (storyCardList.length === 0) {
            this.HideUnusedCardsAndDrawLines();
        } else {
            this.HideAllStoryCards();
            this.ShowOnlyStoryCardsWith(storyCardList);
            this.RemoveHiddenStoryCards();
            this.HideUnusedCards.HideUnusedCardsCore();
            this.DrawLine();
        }
    },
    GetSendToSelectedList: function () {
        if (SourcedActivityDiagram.SelectedStoryCardByFiler.length === 0) {
            return;
        }

        var st = '';
        for (var i in SourcedActivityDiagram.SelectedStoryCardByFiler) {
            st += this.SelectedStoryCardByFiler[i] + "%IN%"
        }



        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.storyCardList = st;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmGetSendToSelectedList",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: false,
            success: function (res) {
                try {
                    var ls = res.kv.fkBacklogId.split('%IN%');
                    for (var l in ls) {
                        SourcedActivityDiagram.SelectedStoryCardByFiler.push(ls[l]);
                    }
                } catch (err) {
                    console.log(err);
                }

            },
            error: function () {
//                Toaster.showError(('somethingww'));
            }
        });
    },
    RemoveHiddenStoryCards: function () {
        $('.sad-storycard').each(function () {
            if ($(this).is(":hidden")) {
                $(this).remove();
            }
        })
    },
    ShowOnlyStoryCardsWith: function (storyCardList) {
        for (var i in storyCardList) {
            $('#b_sc_' + storyCardList[i]).show();
        }
    },
    HideAllStoryCards: function () {
        $('.sad-storycard').each(function () {
            $(this).hide();
        });
    },
    HideAllAPIs: function () {
        $('.sad-apicard').each(function () {
            $(this).remove();
        });
        SourcedActivityDiagram.DrawLine();
    },

    HideAllStoryCards4Filter: function () {
        $('.sad-storycard').each(function () {
            $(this).remove();
        });
        $('.sad-entitycard').each(function () {
            $(this).remove();
        });
        $('.sad-leftapicard').each(function () {
            $(this).remove();
        });

        SourcedActivityDiagram.DrawLine();
    },
    HideAllEntity: function () {
        $('.sad-entitycard').each(function () {
            $(this).remove();
        });
        SourcedActivityDiagram.DrawLine();
    },
    SetUsedBacklog: function (backlogId) {
        if (backlogId.length > 1 && !SourcedActivityDiagram.UsedBacklogs.includes(backlogId)) {
            SourcedActivityDiagram.UsedBacklogs.push(backlogId);
        }
    },
    SetUsedLeftApi: function (backlogId, action) {
        if (backlogId.length > 1 && !SourcedActivityDiagram.UsedLeftApisCore.includes(backlogId)) {
            SourcedActivityDiagram.UsedLeftApisCore.push(backlogId);
            if (action === 'storycard') {
                SourcedActivityDiagram.UsedLeftApisCore4Select.push(backlogId);
            }
        }
    },
    SetUsedLeftEntity: function (backlogId) {
        if (backlogId.length > 1 && !SourcedActivityDiagram.UsedLeftEntity.includes(backlogId)) {
            SourcedActivityDiagram.UsedLeftEntity.push(backlogId);
        }
    },
    SetUsedRightEntity: function (backlogId) {
        if (backlogId.length > 1 && !SourcedActivityDiagram.UsedRightEntity.includes(backlogId)) {
            SourcedActivityDiagram.UsedRightEntity.push(backlogId);
        }
    },
    SetUsedLeftApiInner: function (backlogId) {
        if (backlogId.length > 1 && !SourcedActivityDiagram.UsedLeftApisInner.includes(backlogId)) {
            SourcedActivityDiagram.UsedLeftApisInner.push(backlogId);
        }
    },
    SetUsedRightApiInner: function (backlogId) {
        if (backlogId.length > 1 && !SourcedActivityDiagram.UsedRightApisInner.includes(backlogId)) {
            SourcedActivityDiagram.UsedRightApisInner.push(backlogId);
        }
    },
    SetUsedRightApiCore: function (backlogId, action) {
        if (backlogId.length > 1 && !SourcedActivityDiagram.UsedRightApisCore.includes(backlogId)) {
            SourcedActivityDiagram.UsedRightApisCore.push(backlogId);
            if (action === 'storycard') {
                SourcedActivityDiagram.UsedRightApisCore4Select.push(backlogId);
            }
        }
    },
    HideInputsAndOutput: function () {
        $('.sad-entity-input').hide();
        $('.sad-api-card-input').hide();
        $('.sad-api-card-output').hide();
        $('.sad-story-card-input').hide();
    },
    CoreLines: {
        EL2AL: {},
        EL2SC: {},
        AL2SC: {},
        AL2AL: {},
        SC2SC: {},
        SC2AR: {},
        AR2AR: {},
        AR2ER: {},
        SC2ER: {},
        SC4AR: {},
        AR4AR: {},
        ShortNote4Api: {},
        DrawLines: {
            All: function () {
                SourcedActivityDiagram.RemoveDrawLine();
                this.DrawAL2AL();
                this.DrawAL2SC();
                this.DrawAR2AR();
                this.DrawAR2ER();
                this.DrawEL2AL();
                this.DrawEL2SC();
                this.DrawSC2AR();
                this.DrawSC2ER();
                this.DrawSC2SC();
                this.DrawSC4AR();
                this.DrawAR4AR();
            },
            DrawEL2AL: function () {
                var keys = Object.keys(SourcedActivityDiagram.CoreLines.EL2AL);
                for (var k in keys) {
                    var from = keys[k];
                    var toKeys = SourcedActivityDiagram.CoreLines.EL2AL[from];
                    for (var m in toKeys) {
                        var to = toKeys[m];
                        try {
                            new LeaderLine(
                                    document.getElementById(from),
                                    document.getElementById(to),
                                    {
                                        color: 'rgb(41,146,210)',
//                                    color: 'rgb(255,146,27)',
//                                    dash: true,
                                        startPlug: 'square',
                                        endPlug: 'arrow',
                                        startSocket: 'right',
                                        endSocket: 'left',
                                    }
                            );

                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            },
            DrawEL2SC: function () {
                var keys = Object.keys(SourcedActivityDiagram.CoreLines.EL2SC);
                for (var k in keys) {
                    var from = keys[k];
                    var toKeys = SourcedActivityDiagram.CoreLines.EL2SC[from];
                    for (var m in toKeys) {
                        var to = toKeys[m];
                        try {
                            new LeaderLine(
                                    document.getElementById(from),
                                    document.getElementById(to),
                                    {
//                                    color: 'rgb(41,146,210)',
                                        color: 'rgb(255,146,27)',
//                                    dash: true,
                                        startPlug: 'square',
                                        endPlug: 'arrow',
                                        startSocket: 'right',
                                        endSocket: 'left',
                                    }
                            );

                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            },
            DrawAL2SC: function () {
                var keys = Object.keys(SourcedActivityDiagram.CoreLines.AL2SC);
                for (var k in keys) {
                    var from = keys[k];
                    var toKeys = SourcedActivityDiagram.CoreLines.AL2SC[from];
                    for (var m in toKeys) {
                        var to = toKeys[m];
                        try {
                            new LeaderLine(
                                    document.getElementById(from),
                                    document.getElementById(to),
                                    {
//                                    color: 'rgb(41,146,210)',
                                        color: 'rgb(255,146,27)',
                                        dash: true,
                                        startPlug: 'square',
                                        endPlug: 'arrow',
                                        startSocket: 'right',
                                        endSocket: 'left',
                                    }
                            );

                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            },
            DrawAL2AL: function () {
                var keys = Object.keys(SourcedActivityDiagram.CoreLines.AL2AL);
                for (var k in keys) {
                    var from = keys[k];
                    var toKeys = SourcedActivityDiagram.CoreLines.AL2AL[from];
                    for (var m in toKeys) {
                        var to = toKeys[m];
                        try {
                            new LeaderLine(
                                    document.getElementById(from),
                                    document.getElementById(to),
                                    {
                                        color: 'rgb(41,146,210)',
//                                    color: 'rgb(255,146,27)',
                                        dash: true,
                                        startPlug: 'square',
                                        endPlug: 'arrow',
                                        startSocket: 'right',
                                        endSocket: 'left',
                                    }
                            );

                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            },
            DrawSC2SC: function () {
                var keys = Object.keys(SourcedActivityDiagram.CoreLines.SC2SC);
                for (var k in keys) {
                    var from = keys[k];
                    var toKeys = SourcedActivityDiagram.CoreLines.SC2SC[from];
                    for (var m in toKeys) {
                        var to = toKeys[m];
                        try {
                            new LeaderLine(
                                    document.getElementById(from),
                                    document.getElementById(to),
                                    {
//                                    color: 'rgb(41,146,210)',
                                        color: 'rgb(255,146,27)',
                                        dash: true,
                                        startPlug: 'square',
                                        endPlug: 'arrow',
                                        startSocket: 'right',
                                        endSocket: 'left',
                                    }
                            );

                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            },
            DrawSC2AR: function () {
                var keys = Object.keys(SourcedActivityDiagram.CoreLines.SC2AR);
                for (var k in keys) {
                    var from = keys[k];
                    var toKeys = SourcedActivityDiagram.CoreLines.SC2AR[from];
                    for (var m in toKeys) {
                        var to = toKeys[m];
                        try {
                            new LeaderLine(
                                    document.getElementById(from),
                                    document.getElementById(to),
                                    {
//                                    color: 'rgb(41,146,210)',
                                        color: 'rgb(255,146,27)',
                                        dash: true,
                                        startPlug: 'square',
                                        endPlug: 'arrow',
                                        startSocket: 'right',
                                        endSocket: 'left',
                                    }
                            );

                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            },
            DrawAR2AR: function () {
                var keys = Object.keys(SourcedActivityDiagram.CoreLines.AR2AR);
                for (var k in keys) {
                    var from = keys[k];
                    var toKeys = SourcedActivityDiagram.CoreLines.AR2AR[from];
                    for (var m in toKeys) {
                        var to = toKeys[m];
                        try {
                            new LeaderLine(
                                    document.getElementById(from),
                                    document.getElementById(to),
                                    {
                                        color: 'rgb(41,146,210)',
//                                    color: 'rgb(255,146,27)',
                                        dash: true,
                                        startPlug: 'square',
                                        endPlug: 'arrow',
                                        startSocket: 'right',
                                        endSocket: 'left',
                                    }
                            );

                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            },
            DrawAR2ER: function () {
                var keys = Object.keys(SourcedActivityDiagram.CoreLines.AR2ER);
                for (var k in keys) {
                    var from = keys[k];
                    var toKeys = SourcedActivityDiagram.CoreLines.AR2ER[from];
                    for (var m in toKeys) {
                        var to = toKeys[m];
                        try {
                            new LeaderLine(
                                    document.getElementById(from),
                                    document.getElementById(to),
                                    {
                                        color: 'rgb(41,146,210)',
//                                    color: 'rgb(255,146,27)',
//                                    dash: true,
                                        startPlug: 'square',
                                        endPlug: 'arrow',
                                        startSocket: 'right',
                                        endSocket: 'left',
                                    }
                            );

                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            },
            DrawSC2ER: function () {
                var keys = Object.keys(SourcedActivityDiagram.CoreLines.SC2ER);
                for (var k in keys) {
                    var from = keys[k];
                    var toKeys = SourcedActivityDiagram.CoreLines.SC2ER[from];
                    for (var m in toKeys) {
                        var to = toKeys[m];
                        try {
                            new LeaderLine(
                                    document.getElementById(from),
                                    document.getElementById(to),
                                    {
//                                    color: 'rgb(41,146,210)',
                                        color: 'rgb(255,146,27)',
//                                    dash: true,
                                        startPlug: 'square',
                                        endPlug: 'arrow',
                                        startSocket: 'right',
                                        endSocket: 'left',
                                    }
                            );

                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            },
            DrawSC4AR: function () {
                var keys = Object.keys(SourcedActivityDiagram.CoreLines.SC4AR);
                for (var k in keys) {
                    var from = keys[k];
                    var toKeys = SourcedActivityDiagram.CoreLines.SC4AR[from];
                    for (var m in toKeys) {
                        var to = toKeys[m];
                        var text = SourcedActivityDiagram.CoreLines.ShortNote4Api[from + '__' + to];
                        try {
                            new LeaderLine(
                                    document.getElementById(from),
                                    document.getElementById(to),
                                    {
//                                    color: 'rgb(41,146,210)',
                                        color: '#68EB1C',
                                        dash: true,
                                        startPlug: 'square',
                                        endPlug: 'arrow',
                                        startSocket: 'right',
                                        endSocket: 'left',
                                        endLabel: LeaderLine.pathLabel(text)
                                    },
                                    );

                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            },
            DrawAR4AR: function () {
                var keys = Object.keys(SourcedActivityDiagram.CoreLines.AR4AR);
                for (var k in keys) {
                    var from = keys[k];
                    var toKeys = SourcedActivityDiagram.CoreLines.AR4AR[from];
                    for (var m in toKeys) {
                        var to = toKeys[m];
                        var text = SourcedActivityDiagram.CoreLines.ShortNote4Api[from + '__' + to];
                        try {
                            new LeaderLine(
                                    document.getElementById(from),
                                    document.getElementById(to),
                                    {
//                                    color: 'rgb(41,146,210)',
                                        color: '#68EB1C',
                                        dash: true,
                                        startPlug: 'square',
                                        endPlug: 'arrow',
                                        startSocket: 'right',
                                        endSocket: 'left',
                                        endLabel: LeaderLine.pathLabel(text)
                                    }
                            );

                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            },
        },
        SetPair: function (id, from, to) {
            if (!this[id][from]) {
                this[id][from] = [];
            }
            this[id][from].push(to);

        },
        Empty() {
            this.EL2AL = {};
            this.EL2SC = {};
            this.AL2SC = {};
            this.AL2AL = {};
            this.SC2SC = {};
            this.SC2AR = {};
            this.AR2AR = {};
            this.AR2ER = {};
            this.SC2ER = {};
        }
    },
    LinesFromTo: {},
    LinesFromTo4Send: {},
    LinesFromTo4ApiOutput: {},
    LinesFromTo4RightApiOutput: {},
    Lines4SC2SC: {},
    Lines4EL2SC: {},
    Lines4SC2ER: {},
    Lines4EL2AL: {},
    Lines4AR2ER: {},
    Empty: function () {
        this.UsedLeftEntity = [];
        this.UsedRightEntity = [];
        this.UsedBacklogs = [];
        this.UsedLeftApisInner = [];
        this.UsedLeftApisCore = [];
        this.UsedRightApisCore = [];
        this.UsedLeftApisCore4Select = [];
        this.UsedRightApisCore4Select = [];
        this.UsedRightApisInner = [];
    },
    Reset: function () {
        this.SelectedStoryCardByFiler = [];
        $('.loadSourceActivity').click();
    },
    Init: function () {
        this.CoreLines.Empty();
        this.Empty();
        this.StoryCardZone.Init();
        this.APILeftZone.Init();
        this.APIRightZone.Init();
        this.EntityLeftZone.Init();
        this.EntityRightZone.Init();
//        this.HideUnusedCards.Init();
//        this.HideInputsAndOutput();
//        this.CoreLines.DrawLines.All();
        this.DrawLine();
        if (!this.FilterPool.ShowAPICards) {
            this.HideAllAPIs();
        }
        if (!this.FilterPool.ShowStoryCards) {
            this.HideAllStoryCards4Filter();
        }
        if (!this.FilterPool.ShowEntityCards) {
            this.HideAllEntity();
        }
        if (this.FilterPool.ShowOnlyActiveStoryCards) {
            this.HideUnusedCardsAndDrawLines();
        }

    },
    HideUnusedCardsAndDrawLines: function () {
        this.HideUnusedCards.Init();
        this.DrawLine();
    },
    HideUnusedCards: {
        Init: function () {
            this.HideBacklog();
//            
//            
//            this.HideLeftApi();
//            this.HideRightApi();
//            this.HideRightEntity();

            this.HideUnusedCardsCore();
        },
        HideUnusedCardsCore: function () {
            this.HideAllLeftAPI();
            this.ShowLeftApiInIteration();
            this.RemoveAllHiddenLeftApi();
            this.HideLeftEntity();
            this.HideAllRightAPI();
            this.ShowRightApiInIteration();
            this.RemoveAllHiddenRightApi();
            this.HideRightEntity();
        },
        RemoveAllHiddenLeftApi: function () {
            $('.sad-leftapicard').each(function () {
                if ($(this).is(":hidden")) {
                    $(this).remove();
                }
            })
        },
        RemoveAllHiddenRightApi: function () {
            $('.sad-rightapicard').each(function () {
                if ($(this).is(":hidden")) {
                    $(this).remove();
                }
            })
        },
        ShowLeftApiInIteration: function () {
            var keys = (SourcedActivityDiagram.SelectedStoryCardByFiler.length === 0)
                    ? SourcedActivityDiagram.UsedLeftApisCore
                    : SourcedActivityDiagram.UsedLeftApisCore4Select;
            ;
            for (var i in keys) {
                try {
                    var list = [];
                    this.ShowLeftApiOne(keys[i], 0, list);
                } catch (err) {
                    console.log(err)
                }
            }
        },
        ShowRightApiInIteration: function () {
            var keys = SourcedActivityDiagram.UsedRightApisCore;
            ;
            for (var i in keys) {
                try {
                    var list = [];
                    this.ShowRightApiOne(keys[i], 0, list);
                } catch (err) {
                    console.log(err)
                }
            }
        },
        ShowLeftApiOne: function (backlogId, iteration, list) {
            if (iteration > 50) {
                throw "iteration overload";
            }
            if (list.includes(backlogId)) {
                return;
            }
            list.push(backlogId);
            iteration++;
            $('#p_al_' + backlogId).show();
            this.ShowRelationsByInputs(backlogId, iteration, list);
//            this.ShowRelationsByOutputs(backlogId, iteration,list);
            this.ShowRelationsBySendTo(backlogId, iteration, list)

        },
        ShowRightApiOne: function (backlogId, iteration, list) {
            if (iteration > 50) {
                throw "iteration overload";
            }
            if (list.includes(backlogId)) {
                return;
            }
            list.push(backlogId);
            iteration++;
            $('#p_ar_' + backlogId).show();
            this.ShowRightApisRelationsByInputs(backlogId, iteration, list);
            this.ShowRightApiRelationsByOutputs(backlogId, iteration, list);
            this.ShowRightApiRelationsBySendTo(backlogId, iteration, list)

        },
        ShowRelationsByInputs: function (backlogId, iteration, list) {
            var inp = SACore.GetInputList(backlogId);
            for (var i in inp) {
                var inId = inp[i].trim();
                if (inId === '') {
                    continue;
                }
                if (SAInput.getInputDetails(inId, "inputType") === 'OUT')
                    continue;
                if (SAInput.getInputDetails(inId, "selectFromInputId").length > 0) {
                    SourcedActivityDiagram.HideUnusedCards.ShowLeftApiOne(SAInput.getInputDetails(inId, "selectFromBacklogId"), iteration, list);
                }

                if (SAInput.getInputDetails(inId, "selectFromFiledId").length > 1) {
                    SourcedActivityDiagram.SetUsedLeftEntity(SAInput.getInputDetails(inId, "selectFromTableId"));
                }


            }
        },
        ShowRightApisRelationsByInputs: function (backlogId, iteration, list) {
            var inp = SACore.GetInputList(backlogId);
            for (var i in inp) {
                var inId = inp[i].trim();
                if (inId === '') {
                    continue;
                }
                if (SAInput.getInputDetails(inId, "inputType") === 'OUT')
                    continue;
                if (SAInput.getInputDetails(inId, "selectFromInputId").length > 0) {
                    SourcedActivityDiagram.HideUnusedCards.ShowRightApiOne(SAInput.getInputDetails(inId, "selectFromBacklogId"), iteration, list);
                }


            }
        },
        ShowRelationsByOutputs: function (backlogId, iteration, list) {
            var inp = SACore.GetInputList(backlogId);
            for (var i in inp) {
                var inId = inp[i].trim();
                if (inId === '') {
                    continue;
                }

                if (SAInput.getInputDetails(inId, "inputType") !== 'OUT') {
                    continue;
                }

                if (SAInput.getInputDetails(inId, "sendToInputId").length > 1) {
                    var bid = SAInput.getInputDetails(inId, "sendToBacklogId");
                    if (SACore.GetBacklogDetails(bid, "isApi") === '1') {
                        SourcedActivityDiagram.HideUnusedCards.ShowLeftApiOne(bid, iteration, list);
                    }
                }

            }
        },
        ShowRightApiRelationsByOutputs: function (backlogId, iteration, list) {
            var inp = SACore.GetInputList(backlogId);
            for (var i in inp) {
                var inId = inp[i].trim();
                if (inId === '') {
                    continue;
                }

                if (SAInput.getInputDetails(inId, "inputType") !== 'OUT') {
                    continue;
                }

                if (SAInput.getInputDetails(inId, "sendToInputId").length > 1) {
                    var bid = SAInput.getInputDetails(inId, "sendToBacklogId");
                    if (SACore.GetBacklogDetails(bid, "isApi") === '1') {
                        SourcedActivityDiagram.HideUnusedCards.ShowRightApiOne(bid, iteration, list);
                    }
                }

                if (SAInput.getInputDetails(inId, "sendToFieldId").length > 0) {
                    SourcedActivityDiagram.SetUsedRightEntity(SAInput.getInputDetails(inId, "sendToTableId"));
                }

            }
        },
        ShowRelationsBySendTo: function (backlogId, iteration, list) {
            var keys = SACore.GetBacklogKeys();
            for (var k in keys) {
                if (keys[k].length < 2) {
                    continue;
                }
                if (SACore.GetBacklogDetails(keys[k], "isApi") !== '1') {
                    continue;
                }

                //get inputs
                var inp = SACore.GetInputList(keys[k]);
                for (var i in inp) {
                    var inId = inp[i].trim();
                    if (inId === '') {
                        continue;
                    }


                    if (SAInput.getInputDetails(inId, "inputType") !== 'OUT') {
                        continue;
                    }

                    if (SAInput.getInputDetails(inId, "sendToInputId").length > 1) {
                        var bid = SAInput.getInputDetails(inId, "sendToBacklogId");
                        if (bid === backlogId) {
                            SourcedActivityDiagram.HideUnusedCards.ShowLeftApiOne(keys[k], iteration, list)
                        }
                    }

                }
            }
        },
        ShowRightApiRelationsBySendTo: function (backlogId, iteration, list) {
            var keys = SACore.GetBacklogKeys();
            for (var k in keys) {
                if (keys[k].length < 2) {
                    continue;
                }
                if (SACore.GetBacklogDetails(keys[k], "isApi") !== '1') {
                    continue;
                }

                //get inputs
                var inp = SACore.GetInputList(keys[k]);
                for (var i in inp) {
                    var inId = inp[i].trim();
                    if (inId === '') {
                        continue;
                    }


                    if (SAInput.getInputDetails(inId, "inputType") !== 'OUT') {
                        continue;
                    }

                    if (SAInput.getInputDetails(inId, "sendToInputId").length > 1) {
                        var bid = SAInput.getInputDetails(inId, "sendToBacklogId");
                        if (bid === backlogId) {
                            SourcedActivityDiagram.HideUnusedCards.ShowRightApiOne(keys[k], iteration, list)
                        }
                    }

                }



            }
        },
        HideAllLeftAPI: function () {
            $('.sad-leftapicard').each(function () {
                var bid = $(this).attr('pid');
                if (SourcedActivityDiagram.SelectedStoryCardByFiler.length > 0 &&
                        SourcedActivityDiagram.SelectedStoryCardByFiler.includes(bid)) {
                    //do somethink
                } else {
                    $(this).hide();
                }
            });
        },
        HideAllRightAPI: function () {
            $('.sad-rightapicard').hide();
        },
        HideBacklog: function () {
            $('.sad-storycard').each(function () {
                var backlogId = $(this).attr('pid');
                if (SourcedActivityDiagram.UsedBacklogs.length > 0 &&
                        !SourcedActivityDiagram.UsedBacklogs.includes(backlogId)) {
                    if (SourcedActivityDiagram.SelectedStoryCardByFiler.length > 0
                            && SourcedActivityDiagram.SelectedStoryCardByFiler.includes(backlogId)) {
//do something
                    } else {
                        $(this).remove();
                    }
                }
            })
        },
        HideLeftApi: function () {
            $('.sad-leftapicard').each(function () {
                if (SourcedActivityDiagram.UsedLeftApisInner.length > 0 &&
                        !SourcedActivityDiagram.UsedLeftApisInner.includes($(this).attr('pid'))) {
                    $(this).remove();
                }
            })
        },
        HideLeftEntity: function () {
            $('.sad-leftentitycard').each(function () {
                //SourcedActivityDiagram.UsedLeftEntity.length > 0 &&
                if (
                        !SourcedActivityDiagram.UsedLeftEntity.includes($(this).attr('pid'))) {
                    $(this).remove();
                }
            })
        },
        HideRightEntity: function () {
            $('.sad-rightentitycard').each(function () {
//                SourcedActivityDiagram.UsedRightEntity.length > 0 &&
                if (
                        !SourcedActivityDiagram.UsedRightEntity.includes($(this).attr('pid'))) {
                    $(this).remove();
                }
            })
        },
        HideRightApi: function () {
            $('.sad-rightapicard').each(function () {
                if (SourcedActivityDiagram.UsedRightApisInner.length > 0 &&
                        !SourcedActivityDiagram.UsedRightApisInner.includes($(this).attr('pid'))) {
                    $(this).remove();
                }
            })
        },
    },
    RemoveDrawLine: function () {
        $(".leader-line").remove();
    },
    DrawLine: function () {
        var zm = $('#sadMainPage').css('zoom');
        $('#sadMainPage').css('zoom', '');

        this.RemoveDrawLine();
        if (this.FilterPool.ShowCardDetails) {
            this.DrawLine1();
            this.DrawLine4Send();
            this.DrawLine4ApiOut();
            this.DrawLine4RightApiOut();
            this.DrawLine4SC2SC();
            this.DrawLine4SC2EL();
            this.DrawLine4SC2ER();
            this.DrawLine4EL2AL();
            this.DrawLine4AR2ER();
            this.CoreLines.DrawLines.DrawSC4AR();
            this.CoreLines.DrawLines.DrawAR4AR();
        } else {
            this.HideInputsAndOutput();
            this.CoreLines.DrawLines.All();
        }

        $('#sadMainPage').css('zoom', zm);

    },
    DrawLine1: function () {
        var keys = Object.keys(SourcedActivityDiagram.LinesFromTo);
        for (var k in keys) {
            var from = keys[k];
            var to = SourcedActivityDiagram.LinesFromTo[from];
            try {
                var line = new LeaderLine(
                        document.getElementById(from),
                        document.getElementById(to),
                        {
                            color: 'rgb(255,146,27)',
                            dash: true,
                            startPlug: 'square',
                            endPlug: 'arrow',
                            startSocket: 'right',
                            endSocket: 'left',
                        }
                );
                this.LineList.push(line);
            } catch (err) {
                console.log(err);
            }
        }

    },
    DrawLine4Send: function () {
        var keys = Object.keys(SourcedActivityDiagram.LinesFromTo4Send);
        for (var k in keys) {
            var from = keys[k];
            var to = SourcedActivityDiagram.LinesFromTo4Send[from];
            try {
                var line = new LeaderLine(
                        document.getElementById(from),
                        document.getElementById(to),
                        {
                            color: 'rgb(255,146,27)',
                            dash: true,
                            startPlug: 'square',
                            endPlug: 'arrow',
                            startSocket: 'right',
                            endSocket: 'left'
                        }
                );
                this.LineList.push(line);
            } catch (err) {
                console.log(err);
            }
        }

    },
    DrawLine4EL2AL: function () {
        var keys = Object.keys(SourcedActivityDiagram.Lines4EL2AL);
        for (var k in keys) {
            var from = keys[k];
            var to = SourcedActivityDiagram.Lines4EL2AL[from];
            try {
                var line = new LeaderLine(
                        document.getElementById(from),
                        document.getElementById(to),
                        {
                            color: 'rgb(41,146,210)',
                            startPlug: 'square',
                            endPlug: 'arrow',
                            startSocket: 'right',
                            endSocket: 'left'
                        }
                );
                this.LineList.push(line);
            } catch (err) {
                console.log(err);
            }
        }

    },
    DrawLine4AR2ER: function () {
        var keys = Object.keys(SourcedActivityDiagram.Lines4AR2ER);
        for (var k in keys) {
            var from = keys[k];
            var to = SourcedActivityDiagram.Lines4AR2ER[from];
            try {
                var line = new LeaderLine(
                        document.getElementById(from),
                        document.getElementById(to),
                        {
                            color: 'rgb(41,146,210)',
                            startPlug: 'square',
                            endPlug: 'arrow',
                            startSocket: 'right',
                            endSocket: 'left'
                        }
                );
                this.LineList.push(line);
            } catch (err) {
                console.log(err);
            }
        }

    },
    DrawLine4SC2SC: function () {
        var keys = Object.keys(SourcedActivityDiagram.Lines4SC2SC);
        for (var k in keys) {
            var from = keys[k];
            var to = SourcedActivityDiagram.Lines4SC2SC[from];
            try {
                var line = new LeaderLine(
                        document.getElementById(from),
                        document.getElementById(to),
                        {
                            color: 'rgb(255,146,27)',
                            dash: false,
                            startPlug: 'square',
                            endPlug: 'arrow',
                            startSocket: 'left',
                            endSocket: 'left'
                        }
                );
            } catch (err) {
                console.log(err);
            }
        }

    },
    DrawLine4SC2EL: function () {
        var keys = Object.keys(SourcedActivityDiagram.Lines4EL2SC);
        for (var k in keys) {
            var from = keys[k];
            var to = SourcedActivityDiagram.Lines4EL2SC[from];
            try {
                var line = new LeaderLine(
                        document.getElementById(from),
                        document.getElementById(to),
                        {
                            color: 'rgb(255,146,27)',
                            dash: false,
                            startPlug: 'square',
                            endPlug: 'arrow',
                            startSocket: 'right',
                            endSocket: 'left'
                        }

                );
                this.LineList.push(line);
            } catch (err) {
                console.log(err);
            }
        }

    },
    DrawLine4SC2ER: function () {
        var keys = Object.keys(SourcedActivityDiagram.Lines4SC2ER);
        for (var k in keys) {
            var from = keys[k];
            var to = SourcedActivityDiagram.Lines4SC2ER[from];
            try {
                var line = new LeaderLine(
                        document.getElementById(from),
                        document.getElementById(to),
                        {
                            color: 'rgb(255,146,27)',
                            dash: false,
                            startPlug: 'square',
                            endPlug: 'arrow',
                            startSocket: 'right',
                            endSocket: 'left'
                        }
                );
                this.LineList.push(line);
            } catch (err) {
                console.log(err);
            }
        }

    },
    DrawLine4ApiOut: function () {
        var keys = Object.keys(SourcedActivityDiagram.LinesFromTo4ApiOutput);
        for (var k in keys) {
            var from = keys[k];
            var to = SourcedActivityDiagram.LinesFromTo4ApiOutput[from];
            try {
                var line = new LeaderLine(
                        document.getElementById(from),
                        document.getElementById(to),
                        {
                            color: 'rgb(41,146,210)',
                            dash: true,
                            startPlug: 'square',
                            endPlug: 'arrow',
                            startSocket: 'right',
                            endSocket: 'left'
                        }
                );
                this.LineList.push(line);
            } catch (err) {
                console.log(err);
            }
        }

    },
    DrawLine4RightApiOut: function () {
        var keys = Object.keys(SourcedActivityDiagram.LinesFromTo4RightApiOutput);
        for (var k in keys) {
            var from = keys[k];
            var to = SourcedActivityDiagram.LinesFromTo4RightApiOutput[from];
            try {
                var line = new LeaderLine(
                        document.getElementById(from),
                        document.getElementById(to),
                        {
                            color: 'rgb(41,146,210)',
                            dash: true,
                            startPlug: 'square',
                            endPlug: 'arrow',
                            startSocket: 'right',
                            endSocket: 'left'
                        }
                );
                this.LineList.push(line);
            } catch (err) {
                console.log(err);
            }
        }

    },
    StoryCardZone: {
        Init: function () {
            $('.sadiagram-story-card').html('');
            var keys = SACore.GetBacklogKeys();
            var colId = 1;
            var colCount = SourcedActivityDiagram.FilterPool.StoryCardColumnCount;
            for (var i in keys) {
                var backlogId = keys[i];
                if (SACore.GetBaklogIsApi(backlogId) === '1') {
                    continue;
                }
                if (SourcedActivityDiagram.SelectedStoryCardByFiler.length > 0 &&
                        !SourcedActivityDiagram.SelectedStoryCardByFiler.includes(keys[i])) {
                    continue;
                }

                var div = this.SingleCard(backlogId);
                $('.sadiagram-story-card-core-' + colId).append(div);

                colId = (colId >= colCount) ? 1 : colId + 1;

                //add description related API relation
                var apiList = SACore.GetBacklogKey(backlogId, 'descRelatedId').split(', ');
                var apiDescList = SACore.GetBacklogKey(backlogId, 'descRelatedNote').split('###')
                for (var idx in apiList) {
                    var apiId = apiList[idx];
                    SourcedActivityDiagram.CoreLines.SetPair('SC4AR', 'b_sc_' + backlogId, 'p_ar_' + apiId);
                    SourcedActivityDiagram.CoreLines.ShortNote4Api['b_sc_' + backlogId + "__" + 'p_ar_' + apiId] = apiDescList[idx];

                    SourcedActivityDiagram.SetUsedRightApiInner(backlogId);
                    SourcedActivityDiagram.SetUsedRightApiInner(apiId);
                    SourcedActivityDiagram.SetUsedRightApiCore(apiId);
                }
            }
            $('.screen_pgn_count').first().click();
        },
        SingleCard: function (backlogId) {
            var bname = SACore.GetBacklogname(backlogId);
            var div = $("<div class='col-12 text-center'>")
                    .css("padding", "0px 3px 10px 3px")
                    .addClass('sad-storycard')
                    .attr("pid", backlogId)
                    .attr("id", "b_sc_" + backlogId)
                    .append($('<div class="col-12 text-right">')
                            .css("padding", "0px")
                            .css("margin", "0px")
                            .css("font-size", "7px")
                            .css("color", "grey")
                            .append("<i>Story Card</i>")
                            )
                    .append($('<div class="col-12">')
                            .css("padding", "10px 0px")
                            .css("font-size", "14px")

                            .append($('<span href1="#">')
                                    .css('cursor', 'pointer')
                                    .css("color", "grey")
                                    .css("padding", "5px 0px")
                                    .attr('onclick', 'callStoryCard("' + backlogId + '")')
                                    .append(bname)
                                    ));
            this.Screen(div, backlogId);
            this.Inputs(div, backlogId);
            return div;
        },
        Screen: function (div, backlogId) {
            if (!SourcedActivityDiagram.FilterPool.ShowScreens) {
                return;
            }

            div.css("max-width", "540px");

            var idx = 1;
            var screenPgn = $("<div>").addClass("col-12");

            var showPro = SACore.GetBacklogDetails(backlogId, "showPrototype");
            if (showPro === '1') {
                screenPgn.append($('<a>')
                        .attr("pid", idx)
                        .css("color", "blue")
                        .css('cursor', 'pointer')
                        .addClass('screen_pgn_count')
                        .append(idx))

                var gui = new UserStory().genGUIDesignHtmlById(backlogId);
                div.append($('<div class="col-12">')
                        .addClass('img_slider')
                        .addClass('img_slider_' + idx)
                        .css("display", "none")
                        .css("padding", "10px 0px")
                        .append(gui));

                idx++;
            }


            var fileUrlUS = SACore.GetBacklogDetails(backlogId, "fileUrl").split(',');
            var fileUrlUSIds = SACore.GetBacklogDetails(backlogId, "fileUrlIds").split(',');
            for (var i = 0; i < fileUrlUSIds.length; i++) {
                var id = fileUrlUSIds[i].trim();
                if (!SACore.IsImagePinned(id)) {
                    continue;
                }

                screenPgn.append($('<a>')
                        .attr("pid", idx)
                        .css("color", "blue")
                        .css('cursor', 'pointer')
                        .addClass('screen_pgn_count')
                        .append(idx))

                var fname = fileUrlUS[i].trim();
                var img = $('<img>')
                        .addClass('img_slider')
                        .addClass('img_slider_' + idx)
                        .css("display", "none")
                        .attr("src", fileUrl(fname))
                        .css("max-width", "95%")
                        .css("max-height", "300px")

                div.append($('<div class="col-12">')
                        .css("padding", "10px 0px")
                        .append(img)
                        );

                idx++;
            }

            div.append(screenPgn);
            $('.screen_pgn_count').first().click();
        },
        Inputs: function (cardDiv, backlogId) {
            var inp = SACore.GetInputList(backlogId);
            var f4SC = false;
            for (var i in inp) {
                var inId = inp[i].trim();
                if (inId === '') {
                    continue;
                }

                if (SAInput.getInputDetails(inId, "inputType") !== 'IN') {
                    continue;
                }
                if (SAInput.getInputDetails(inId, "inputType") === 'IN' &&
                        (SAInput.getInputDetails(inId, "componentType") === 'sctn' ||
                                SAInput.getInputDetails(inId, "componentType") === 'tab')) {
                    continue;
                }
                if (SAInput.getInputDetails(inId, "selectFromInputId").length > 0) {
                    var tid = SAInput.getInputDetails(inId, "selectFromInputId");
                    var tbid = SAInput.getInputDetails(inId, "selectFromBacklogId");
                    SourcedActivityDiagram.SetUsedLeftApi(tbid, 'storycard');
                    var fromId = "al_" + tid;
                    var to = "sc_" + inId;
                    SourcedActivityDiagram.LinesFromTo[fromId] = to;

                    SourcedActivityDiagram.CoreLines.SetPair('AL2SC', 'p_al_' + tbid, 'b_sc_' + backlogId);

                    f4SC = true;
                }
                if (SAInput.getInputDetails(inId, "selectFromFieldId").length > 0) {
                    var fromId = "el_" + SAInput.getInputDetails(inId, "selectFromFieldId");
                    var toId = "sc_" + inId;
                    SourcedActivityDiagram.Lines4EL2SC[fromId] = toId;
                    SourcedActivityDiagram.SetUsedLeftEntity(SAInput.getInputDetails(inId, "selectFromTableId"));

                    SourcedActivityDiagram.CoreLines.SetPair('EL2SC', 'p_el_' + SAInput.getInputDetails(inId, "selectFromTableId"), 'b_sc_' + backlogId);

                    f4SC = true;
                }
                if (SAInput.getInputDetails(inId, "sendToFieldId").length > 0) {
                    var toId = "er_" + SAInput.getInputDetails(inId, "sendToFieldId");
                    var fromId = "sc_" + inId;
                    SourcedActivityDiagram.Lines4SC2ER[fromId] = toId;
                    SourcedActivityDiagram.SetUsedRightEntity(SAInput.getInputDetails(inId, "sendToTableId"));

                    SourcedActivityDiagram.CoreLines.SetPair('SC2ER', 'b_sc_' + backlogId, 'p_er_' + SAInput.getInputDetails(inId, "sendToTableId"));

                    f4SC = true;
                }
                if (SAInput.getInputDetails(inId, "sendToInputId").length > 0) {
                    var bid = SAInput.getInputDetails(inId, "sendToBacklogId");
                    var toId = SACore.GetBacklogDetails(bid, "isApi") === '1'
                            ? "ar_" + SAInput.getInputDetails(inId, "sendToInputId")
                            : "sc_" + SAInput.getInputDetails(inId, "sendToInputId");
                    if (SACore.GetBacklogDetails(bid, "isApi") === '1') {
                        SourcedActivityDiagram.SetUsedRightApiInner(bid);
                        SourcedActivityDiagram.SetUsedRightApiCore(bid, 'storycard');

                        SourcedActivityDiagram.CoreLines.SetPair('SC2AR', 'b_sc_' + backlogId, 'p_ar_' + bid);

                    } else if (SACore.GetBacklogDetails(bid, "isApi") !== '1') {
                        if (SourcedActivityDiagram.SelectedStoryCardByFiler.length > 0) {
                            SourcedActivityDiagram.SelectedStoryCardByFiler.push(bid);
                        }

                        SourcedActivityDiagram.CoreLines.SetPair('SC2SC', 'b_sc_' + backlogId, 'b_sc_' + bid);
                    }

                    SourcedActivityDiagram.LinesFromTo4Send["sc_" + inId] = toId;
                    f4SC = true;
                }




                cardDiv.append(this.InputLine(inId));
            }




            if (f4SC) {
                SourcedActivityDiagram.SetUsedBacklog(backlogId);
            }

        },
        InputLine: function (inputId) {
            var div = $("<div>")
                    .addClass("text-left")
                    .attr("id", "sc_" + inputId)
                    .addClass("sad-story-card-input")
                    .append(SAInput.GetInputName(inputId));
            return div;
        }
    },
    EntityLeftZone: {
        Init: function () {
            $('.sadiagram-entityleft').html('');
            var keys = Object.keys(SAEntity.Tables)//SourcedActivityDiagram.AssignedEntity.Entity;
            for (var i in keys) {
                var div = this.SingleCard(keys[i]);
                $('.sadiagram-entityleft').append(div);
            }
        },
        SingleCard: function (tableId) {
            var dbid = SAEntity.TableDBs[tableId];
            var dbname = SAEntity.GetDBDetails(dbid, "dbName");
            var bname = SAEntity.GetTableDetails(tableId, "tableName");
            var div = $("<div class='col-12 text-center'>")
                    .css("padding", "0px 3px 10px 3px")
                    .addClass('sad-entitycard')
                    .addClass("sad-leftentitycard")
                    .attr("id", "p_el_" + tableId)
                    .attr("pid", tableId)
                    .append($('<div class="col-12 text-right">')
                            .css("padding", "0px")
                            .css("margin", "0px")
                            .css("font-size", "7px")
                            .css("color", "grey")
                            .append("<i>Entity<i>")
                            )
                    .append($('<div class="col-12">')
                            .css("padding", "10px 0px")
                            .css("font-size", "14px")
                            .append($('<a href1="#">')
                                    .css('cursor', 'pointer')
                                    .css("color", "black")
                                    .attr('onclick1', 'callStoryCard("' + tableId + '")')
                                    .append(bname + " (<i>from </i>" + dbname + ")")
                                    ));
            this.Inputs(div, tableId);
            return div;
        },
        Inputs: function (cardDiv, backlogId) {
            try {
                var inp = SAEntity.TableFields[backlogId].split(',');
                for (var i in inp) {
                    var inId = inp[i].trim();
                    if (inId === '') {
                        continue;
                    }

                    cardDiv.append(this.InputLine(inId));
                }
            } catch (err) {
                console.log(err);
            }
        },
        InputLine: function (inputId) {
            var div = $("<div>")
                    .addClass("text-left")
                    .attr("id", "el_" + inputId)
                    .addClass("sad-entity-input")
                    .append(SAEntity.GetFieldDetails(inputId, "fieldName"));
            return div;
        }
    },
    EntityRightZone: {
        Init: function () {
            $('.sadiagram-entityright').html('');
            var keys = Object.keys(SAEntity.Tables)//SourcedActivityDiagram.AssignedEntity.Entity;
            for (var i in keys) {
                var div = this.SingleCard(keys[i]);
                $('.sadiagram-entityright').append(div);
            }
        },
        SingleCard: function (tableId) {
            var dbid = SAEntity.TableDBs[tableId];
            var dbname = SAEntity.GetDBDetails(dbid, "dbName");
            var bname = SAEntity.GetTableDetails(tableId, "tableName");
            var div = $("<div class='col-12 text-center'>")
                    .css("padding", "0px 3px 10px 3px")
                    .addClass('sad-entitycard')
                    .addClass("sad-rightentitycard")
                    .attr("id", "p_er_" + tableId)
                    .attr("pid", tableId)
                    .append($('<div class="col-12 text-right">')
                            .css("padding", "0px")
                            .css("margin", "0px")
                            .css("font-size", "7px")
                            .css("color", "grey")
                            .append("<i>Entity<i>")
                            )
                    .append($('<div class="col-12">')
                            .css("padding", "10px 0px")
                            .css("font-size", "14px")
                            .append($('<a href1="#">')
                                    .css('cursor', 'pointer')
                                    .css("color", "black")
                                    .attr('onclick1', 'callStoryCard("' + tableId + '")')
                                    .append(bname + " (<i>from </i>" + dbname + ")")
                                    ));
            this.Inputs(div, tableId);
            return div;
        },
        Inputs: function (cardDiv, backlogId) {
            try {
                var inp = SAEntity.TableFields[backlogId].split(',');
                for (var i in inp) {
                    var inId = inp[i].trim();
                    if (inId === '') {
                        continue;
                    }

                    cardDiv.append(this.InputLine(inId));
                }
            } catch (err) {
                console.log(err);
            }
        },
        InputLine: function (inputId) {
            var div = $("<div>")
                    .addClass("text-left")
                    .attr("id", "er_" + inputId)
                    .addClass("sad-entity-input")
                    .append(SAEntity.GetFieldDetails(inputId, "fieldName"));
            return div;
        }
    },
    APILeftZone: {
        Init: function () {
            var keys = SACore.GetBacklogKeys();
//            var keys = SourcedActivityDiagram.UsedLeftApis;
            $('.sadiagram-apileft').html('');
            for (var i in keys) {
                if (keys[i].length < 2) {
                    continue;
                }
                if (SACore.GetBacklogDetails(keys[i], "isApi") !== '1') {
                    continue;
                }

                var div1 = this.SingleCard(keys[i]);
                $('.sadiagram-apileft').append(div1);
            }
        },
        SingleCard: function (backlogId) {
            var bname = SACore.GetBacklogname(backlogId);
            var div = $("<div class='row sad-apicard-col text-center'>")
                    .css("padding", "0px 3px 10px 3px")
                    .addClass('sad-apicard')
                    .addClass('sad-leftapicard')
                    .attr("id", "p_al_" + backlogId)
                    .attr("pid", backlogId)
                    .append($('<div class="col-12 text-right">')
                            .css("padding", "0px")
                            .css("margin", "0px")
                            .css("font-size", "7px")
                            .css("color", "grey")
                            .append("<i>API</i>")
                            )
                    .append($("<div class='col-12'>")
                            .css("padding", "10px 0px")
                            .css("font-size", "14px")
                            .append($('<span href1="#">')
                                    .css('cursor', 'pointer')
                                    .css("color", "black")
                                    .attr('onclick', 'callStoryCard("' + backlogId + '")')
                                    .append(bname)));
            var divIn = $("<div class='col-6'>")
                    .css("padding", "0px")
                    .css("width", "130px");
            var divOut = $("<div class='col-6'>")
                    .css("padding", "0px")
                    .css("width", "130px");
            this.Inputs(divIn, backlogId);
            this.Outputs(divOut, backlogId);
            div.append(divIn).append(divOut);
            return div;
        },
        Inputs: function (cardDiv, backlogId) {
            var inp = SACore.GetInputList(backlogId);
            for (var i in inp) {
                var inId = inp[i].trim();
                if (inId === '') {
                    continue;
                }
                if (SAInput.getInputDetails(inId, "inputType") === 'OUT')
                    continue;

                if (SAInput.getInputDetails(inId, "selectFromFieldId").length > 0) {
                    var fromId = "el_" + SAInput.getInputDetails(inId, "selectFromFieldId");
                    var toId = "al_" + inId;
                    SourcedActivityDiagram.Lines4EL2AL[fromId] = toId;
                    SourcedActivityDiagram.SetUsedLeftEntity(SAInput.getInputDetails(inId, "selectFromTableId"));
                    SourcedActivityDiagram.SetUsedLeftApiInner(backlogId);

                    SourcedActivityDiagram.CoreLines.SetPair('EL2AL', 'p_el_' + SAInput.getInputDetails(inId, "selectFromTableId"), 'p_al_' + backlogId);

                }

                if (SAInput.getInputDetails(inId, "selectFromInputId").length > 0) {
                    var fromId = "al_" + SAInput.getInputDetails(inId, "selectFromInputId");
                    var toId = "al_" + inId;
                    SourcedActivityDiagram.Lines4EL2AL[fromId] = toId;
                    SourcedActivityDiagram.SetUsedLeftApiInner(SAInput.getInputDetails(inId, "selectFromBacklogId"));
                    SourcedActivityDiagram.SetUsedLeftApiInner(backlogId);

                    SourcedActivityDiagram.CoreLines.SetPair('AL2AL', 'p_al_' + SAInput.getInputDetails(inId, "selectFromBacklogId"), 'p_al_' + backlogId);
                }


                cardDiv.append(this.InputLine(inId));
            }
        },
        Outputs: function (cardDiv, backlogId) {
            var inp = SACore.GetInputList(backlogId);
            for (var i in inp) {
                var inId = inp[i].trim();
                if (inId === '') {
                    continue;
                }


                if (SAInput.getInputDetails(inId, "inputType") !== 'OUT') {
                    continue;
                }

                cardDiv.append(this.OutputLine(inId));
                if (SAInput.getInputDetails(inId, "sendToInputId").length > 1) {
                    var fromId = "al_" + inId;
                    var bid = SAInput.getInputDetails(inId, "sendToBacklogId");
                    var toId = SACore.GetBacklogDetails(bid, "isApi") === '1'
                            ? "al_" + SAInput.getInputDetails(inId, "sendToInputId")
                            : "sc_" + SAInput.getInputDetails(inId, "sendToInputId")

                    SourcedActivityDiagram.LinesFromTo4ApiOutput[fromId] = toId;
                    if (SACore.GetBacklogDetails(bid, "isApi") === '1') {
                        SourcedActivityDiagram.SetUsedLeftApiInner(bid);
                        SourcedActivityDiagram.SetUsedLeftApiInner(backlogId);

                        SourcedActivityDiagram.CoreLines.SetPair('AL2AL', 'p_al_' + backlogId, 'p_al_' + bid);

                    } else {
                        SourcedActivityDiagram.SetUsedLeftApi(backlogId);

                        SourcedActivityDiagram.CoreLines.SetPair('AL2SC', 'p_al_' + backlogId, 'b_sc_' + bid);
                    }
                }

            }
        },
        InputLine: function (inputId) {
            var div = $("<div>")
                    .addClass("text-left")
                    .attr("id", "al_" + inputId)
                    .addClass("sad-api-card-input")
                    .append(SAInput.GetInputName(inputId));
            return div;
        },
        OutputLine: function (inputId) {
            var div = $("<div>")
                    .addClass("text-left")
                    .attr("id", "al_" + inputId)
                    .addClass("sad-api-card-output")
                    .append(SAInput.GetInputName(inputId));
            return div;
        }
    },
    APIRightZone: {
        Init: function () {
            var keys = SACore.GetBacklogKeys();
//            var keys = SourcedActivityDiagram.UsedRightApis;
            $('.sadiagram-apiright').html('');
            var colId = 1;
            var colCount = SourcedActivityDiagram.FilterPool.APIRightColumnCount;
            for (var i in keys) {
                var backlogId = keys[i];
                if (keys[i].length < 2) {
                    continue;
                }
                if (SACore.GetBacklogDetails(keys[i], "isApi") !== '1') {
                    continue;
                }
                var div1 = this.SingleCard(keys[i]);
                $('.sadiagram-apiright-core-' + colId).append(div1);

                colId = (colId >= colCount) ? 1 : colId + 1;

                //add description related API relation
                this.AddDescriptionRelatedAPIs(backlogId);
            }
        },
        AddDescriptionRelatedAPIs: function (backlogId) {
            var apiList = SACore.GetBacklogKey(backlogId, 'descRelatedId').split(', ');
            var apiDescList = SACore.GetBacklogKey(backlogId, 'descRelatedNote').split('###')
            for (var idx in apiList) {
                var apiId = apiList[idx];
                SourcedActivityDiagram.CoreLines.SetPair('AR4AR', 'p_ar_' + backlogId, 'p_ar_' + apiId);
                SourcedActivityDiagram.CoreLines.ShortNote4Api['p_ar_' + backlogId + "__" + 'p_ar_' + apiId] = apiDescList[idx];

                SourcedActivityDiagram.SetUsedRightApiInner(backlogId);
                SourcedActivityDiagram.SetUsedRightApiInner(apiId);
            }
        },
        SingleCard: function (backlogId) {
            var bname = SACore.GetBacklogname(backlogId);
            var div = $("<div class='row sad-apicard-col text-center'>")
                    .css("padding", "0px 3px 10px 3px")
                    .addClass('sad-apicard')
                    .addClass('sad-rightapicard')
                    .attr("pid", backlogId)
                    .attr("id", "p_ar_" + backlogId)
                    .append($('<div class="col-12 text-right">')
                            .css("padding", "0px")
                            .css("margin", "0px")
                            .css("font-size", "7px")
                            .css("color", "grey")
                            .append("<i>API</i>")
                            )
                    .append($("<div class='col-12'>")
                            .css("padding", "10px 0px")
                            .css("font-size", "14px")
                            .append($('<span href1="#">')
                                    .css("padding", "10px 0px")
                                    .css('cursor', 'pointer')
                                    .css("color", "black")
                                    .attr('onclick', 'callStoryCard("' + backlogId + '")')
                                    .append(bname)));
            var divIn = $("<div class='col-6'>")
                    .css("padding", "0px")
                    .css("width", "130px");
            var divOut = $("<div class='col-6'>")
                    .css("padding", "0px")
                    .css("width", "130px");
            this.Inputs(divIn, backlogId);
            this.Outputs(divOut, backlogId);
            div.append(divIn).append(divOut);
            return div;
        },
        Inputs: function (cardDiv, backlogId) {
            var inp = SACore.GetInputList(backlogId);
            for (var i in inp) {
                var inId = inp[i].trim();
                if (inId === '') {
                    continue;
                }
                if (SAInput.getInputDetails(inId, "inputType") === 'OUT')
                    continue;

                if (SAInput.getInputDetails(inId, "selectFromInputId").length > 0) {
                    var fromId = "ar_" + SAInput.getInputDetails(inId, "selectFromInputId");
                    var toId = "ar_" + inId;
                    SourcedActivityDiagram.Lines4EL2AL[fromId] = toId;
                    SourcedActivityDiagram.SetUsedRightApiInner(SAInput.getInputDetails(inId, "selectFromBacklogId"));
                    SourcedActivityDiagram.SetUsedRightApiInner(backlogId);

                    SourcedActivityDiagram.CoreLines.SetPair('AR2AR', 'p_ar_' + SAInput.getInputDetails(inId, "selectFromBacklogId"), 'p_ar_' + backlogId);
                }


                cardDiv.append(this.InputLine(inId));
            }
        },
        Outputs: function (cardDiv, backlogId) {
            var inp = SACore.GetInputList(backlogId);
            for (var i in inp) {
                var inId = inp[i].trim();
                if (inId === '') {
                    continue;
                }
                if (SAInput.getInputDetails(inId, "inputType") !== 'OUT')
                    continue;
                cardDiv.append(this.OutputLine(inId));

                if (SAInput.getInputDetails(inId, "sendToInputId").length > 1) {
                    var fromId = "ar_" + inId;
                    var bid = SAInput.getInputDetails(inId, "sendToBacklogId");
                    var toId = SACore.GetBacklogDetails(bid, "isApi") === '1'
                            ? "ar_" + SAInput.getInputDetails(inId, "sendToInputId")
                            : "";
                    if (toId.trim().length > 1) {
                        SourcedActivityDiagram.LinesFromTo4RightApiOutput[fromId] = toId;
                    }

                    if (SACore.GetBacklogDetails(bid, "isApi") === '1') {
                        SourcedActivityDiagram.SetUsedRightApiInner(bid);
                        SourcedActivityDiagram.SetUsedRightApiInner(backlogId);

                        SourcedActivityDiagram.CoreLines.SetPair('AR2AR', 'p_ar_' + backlogId, 'p_ar_' + bid);
                    }
                }

                if (SAInput.getInputDetails(inId, "sendToFieldId").length > 0) {
                    var toId = "er_" + SAInput.getInputDetails(inId, "sendToFieldId");
                    var fromId = "ar_" + inId;
                    SourcedActivityDiagram.Lines4AR2ER[fromId] = toId;

                    SourcedActivityDiagram.CoreLines.SetPair('AR2ER', 'p_ar_' + backlogId, 'p_er_' + SAInput.getInputDetails(inId, "sendToTableId"));
                }

            }
        },
        InputLine: function (inputId) {
            var div = $("<div>")
                    .addClass("text-left")
                    .attr("id", "ar_" + inputId)
                    .addClass("sad-api-card-input")
                    .append(SAInput.GetInputName(inputId));
            return div;
        },
        OutputLine: function (inputId) {
            var div = $("<div>")
                    .addClass("text-left")
                    .attr("id", "ar_" + inputId)
                    .addClass("sad-api-card-output")
                    .append(SAInput.GetInputName(inputId));
            return div;
        }
    },
}