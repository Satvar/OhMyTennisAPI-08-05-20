const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const lang = require("../../../lang/language").franchContent;

exports.create = async function(req, res, next) {
  var _output = new output();
  var search_box1 = 0;
  var banner_box1 = 0;
  var publish_box1 = 0;
  var isDelete = 0;
  const {
    id,
    menu_id,
    title,
    path,
    seo_keyword,
    seo_description,
    search_box,
    banner_box,
    is_publish,
    photo,
    content,
    banner_content
  } = req.body;
  //console.log(title);
  if (
    menu_id != "" &&
    path != "" &&
    seo_keyword != "" &&
    seo_description != "" &&
    content != ""
  ) {
    if (search_box === true) {
      search_box1 = 1;
    }
    if (banner_box === true) {
      banner_box1 = 1;
    }
    if (is_publish === true) {
      publish_box1 = 1;
    }

    var pathVal = "";
    if (publish_box1 > 0) {
      pathVal = path;
      isDelete = 1;
    }
    var pathQueryUpdate =
      "UPDATE `menu` SET `path`='" +
      pathVal +
      "', `is_delete`='" +
      isDelete +
      "' WHERE `id` = " +
      menu_id;

    if (id == "") {
      var insert_query =
        "INSERT INTO `cms` (`menu_id`, `title`, `path`, `seo_keyword`, `seo_description`,`search_box`,`banner_box`, `is_publish`, `photo`, `content`,`banner_content`) VALUES (?,?,?,?,?,?,?,?,?,?,?);";

      await db_library
        .parameterexecute(insert_query, [
          menu_id,
          title,
          path,
          seo_keyword,
          seo_description,
          search_box1,
          banner_box1,
          publish_box1,
          photo,
          content,
          banner_content
        ])
        .then(async val => {
          await db_library
            .execute(pathQueryUpdate)
            .then(valpathdata => {
              _output.data = val;
              _output.isSuccess = true;
              _output.message = lang.content_create_success;
            })
            .catch(err => {
              console.log(err.message);
              _output.data = err.message;
              _output.isSuccess = false;
              _output.message = lang.content_create_fail;
            });
        })
        .catch(err => {
          console.log(err.message);
          _output.data = err.message;
          _output.isSuccess = false;
          _output.message = lang.content_create_fail;
        });
    } else if (id != "") {
      var update_query =
        "Update `cms` set `menu_id`=?, `title`=?, `path`=?, `seo_keyword` =?, `seo_description` =?, `search_box` =?, `banner_box` =?, `is_publish` =?, `photo` =?, `content` =?, `banner_content`=? where `id`=?";

      await db_library
        .parameterexecute(update_query, [
          menu_id,
          title,
          path,
          seo_keyword,
          seo_description,
          search_box1,
          banner_box1,
          publish_box1,
          photo,
          content,
          banner_content,
          id
        ])
        .then(async val => {
          await db_library
            .execute(pathQueryUpdate)
            .then(valpathdata => {
              _output.data = val;
              _output.isSuccess = true;
              _output.message = lang.content_create_success;
            })
            .catch(err => {
              _output.data = err.message;
              _output.isSuccess = false;
              _output.message = lang.content_create_fail;
            });
        })
        .catch(err => {
          _output.data = {};
          _output.isSuccess = false;
          _output.message = lang.content_create_fail;
        });
    }
  } else {
    _output.data = lang.required_field;
    _output.isSuccess = false;
    _output.message = lang.content_create_fail;
  }
  res.send(_output);
};

exports.getcmsmenu = async function(req, res, next) {
  var _output = new output();
  var query = "SELECT `id`, `menu_id`, `path` FROM `cms`";
  await db_library
    .execute(query)
    .then(value => {
      var obj = {
        cms_list: value
      };
      var result = obj;
      _output.data = result;
      _output.isSuccess = true;
      _output.message = lang.content_get_success;
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = lang.contetn_get_fail;
    });
  res.send(_output);
};

exports.getCmsData = async function(req, res, next) {
  var _output = new output();
  const endpoint = req.params.endpoint;
  if (endpoint != "") {
    var query =
      "SELECT * FROM `cms` WHERE `path`= '" +
      endpoint +
      "' AND `is_publish` = '1'";
    await db_library
      .execute(query)
      .then(value => {
        if (value.length > 0) {
          var result = value;
          var obj = {
            cms_list: result
          };
          _output.data = obj;
          _output.isSuccess = true;
          _output.message = lang.content_get_success;
        } else {
          _output.data = {};
          _output.isSuccess = false;
          _output.message = "No cms found";
        }
      })
      .catch(err => {
        _output.data = err.message;
        _output.isSuccess = false;
        _output.message = lang.contetn_get_fail;
      });
  } else {
    _output.data = lang.booking_request;
    _output.isSuccess = false;
    _output.message = lang.contetn_get_fail;
  }
  res.send(_output);
};

exports.getCms = async function(req, res, next) {
  var _output = new output();
  async function getMenu(id) {
    try {
      const menuQuery = "SELECT * FROM `menu` WHERE `id`= '" + id + "'";
      return await db_library.execute(menuQuery).then(async data => {
        return data;
      });
    } catch (error) {
      return error;
    }
  }
  var query = "SELECT `id`,`menu_id`,`title` FROM `cms`";
  var obj = {};
  let menuData = [];
  await db_library
    .execute(query)
    .then(async value => {
      if (value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          const menuname = await getMenu(value[i].menu_id);

          if (menuname.length > 0) {
            const menuFields = {
              id: value[i].id,
              menuName:
                menuname[0].main_menu != ""
                  ? menuname[0].main_menu
                  : menuname[0].primary_menu != ""
                  ? menuname[0].primary_menu
                  : menuname[0].secondary_menu,
              title: value[i].title,
              position: menuname[0].position
            };
            menuData.push(menuFields);
          }
        }
        //console.log(menuData);
      }
      obj = {
        cms_list: menuData
      };
      //console.log(obj);
      var result = obj;
      _output.data = result;
      _output.isSuccess = true;
      _output.message = lang.content_get_success;
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = lang.contetn_get_fail;
    });
  res.send(_output);
};

exports.getCmsvalue = async function(req, res, next) {
  var _output = new output();
  const endpoint = req.params.endpoint;
  const cmsID = req.body.cms_id;
  if (endpoint != "" && cmsID != "") {
    var query = "SELECT * FROM `cms` WHERE `id`= " + cmsID;
    await db_library
      .execute(query)
      .then(value => {
        if (value.length > 0) {
          var result = value;
          var obj = {
            cms_list: result
          };
          _output.data = obj;
          _output.isSuccess = true;
          _output.message = lang.content_get_success;
        } else {
          _output.data = {};
          _output.isSuccess = false;
          _output.message = "No cms found";
        }
      })
      .catch(err => {
        _output.data = err.message;
        _output.isSuccess = false;
        _output.message = lang.contetn_get_fail;
      });
  } else {
    _output.data = lang.booking_request;
    _output.isSuccess = false;
    _output.message = lang.contetn_get_fail;
  }
  res.send(_output);
};

exports.delete = async function(req, res, next) {
  var _output = new output();
  const cmsID = req.body.cmsid;
  //console.log("cms.js--delete", cmsID);
  async function updatePath(id) {
    try {
      var pathQueryUpdate = "UPDATE `menu` SET `path`= '' WHERE `id` = " + id;
      return await db_library.execute(pathQueryUpdate).then(async data => {
        return data;
      });
    } catch (error) {
      return error;
    }
  }

  async function deletePath(id) {
    try {
      var pathQueryUpdate = "DELETE FROM `cms` WHERE `id` = " + id;
      return await db_library.execute(pathQueryUpdate).then(async data => {
        return data;
      });
    } catch (error) {
      return error;
    }
  }

  var selectQuery = "SELECT `menu_id` FROM `cms` WHERE `id`= " + cmsID;
  await db_library
    .execute(selectQuery)
    .then(async selectQueryValue => {
      //console.log("cms.js--delete", selectQueryValue.length);
      await updatePath(selectQueryValue[0].menu_id);
      //console.log("cms.js--delete -- update path");
      await deletePath(cmsID);
      //console.log("cms.js--delete -- delete path");
      if (selectQueryValue.length > 0) {
        _output.data = {};
        _output.isSuccess = true;
        _output.message = lang.content_get_success;
      } else {
        _output.data = {};
        _output.isSuccess = false;
        _output.message = "No cms found";
      }
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = lang.contetn_get_fail;
    });

  res.send(_output);
};

exports.deleteMenu = async function(req, res, next) {
  var _output = new output();
  const menuID = req.body.menuid;
  var selectQuery = "SELECT `id` FROM `menu` WHERE `id`= " + menuID;
  var pathQueryUpdate = "DELETE FROM `menu` WHERE `id` = " + menuID;
  await db_library
    .execute(selectQuery)
    .then(async selectQueryValue => {})
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = lang.contetn_get_fail;
    });

  // await db_library
  //   .execute(pathQueryUpdate)
  //   .then(async data => {
  // if (data.length > 0) {
  //   _output.data = {};
  //   _output.isSuccess = true;
  //   _output.message = lang.content_get_success;
  // } else {
  //   _output.data = {};
  //   _output.isSuccess = false;
  //   _output.message = "No cms found";
  // }
  // })
  // .catch(err => {
  //   _output.data = err.message;
  //   _output.isSuccess = false;
  //   _output.message = lang.contetn_get_fail;
  // });

  res.send(_output);
};

exports.update = async function(req, res, next) {
  var _output = new output();
  // const menu_id = req.body.id;
  // const menu_name = req.body.menu;
  // const menu_position = req.body.menu_position;
  const { id, menu, menu_position } = req.body;
  //console.log(req.body);
  var pathQueryUpdate;
  if (menu_position == "main") {
    pathQueryUpdate =
      "UPDATE `menu` SET `main_menu`= '" + menu + "' WHERE `id` = " + id;
  }

  if (menu_position == "primary") {
    pathQueryUpdate =
      "UPDATE `menu` SET `primary_menu`= '" + menu + "' WHERE `id` = " + id;
  }

  if (menu_position == "secondary") {
    pathQueryUpdate =
      "UPDATE `menu` SET `secondary_menu`= '" + menu + "' WHERE `id` = " + id;
  }

  await db_library
    .execute(pathQueryUpdate)
    .then(async data => {
      //console.log(data.affectedRows);
      if (data.affectedRows > 0) {
        _output.data = {};
        _output.isSuccess = true;
        _output.message = lang.content_get_success;
      } else {
        _output.data = {};
        _output.isSuccess = false;
        _output.message = "";
      }
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = lang.contetn_get_fail;
    });

  res.send(_output);
};
