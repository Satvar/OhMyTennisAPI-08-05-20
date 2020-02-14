const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const lang = require("../../../lang/language").franchContent;

exports.createParent = async function(req, res, next) {
  var _output = new output();
  const { mainmenu } = req.body;
  if (mainmenu != "") {
    var mainMenuQuery =
      "INSERT INTO `menu`(`main_menu`) VALUES ('" + mainmenu + "')";
    try {
      await db_library
        .execute(mainMenuQuery)
        .then(async val => {
          const query =
            "SELECT `id`,`main_menu` FROM `menu` WHERE `parent_id`= '0'";

          await db_library
            .execute(query)
            .then(async value => {
              _output.data = value;
              _output.isSuccess = true;
              _output.message = "Get all menu data";
            })
            .catch(err => {
              _output.data = {};
              _output.isSuccess = false;
              _output.message = "Get menu data failed ";
            });
        })
        .catch(err => {
          _output.data = err.message;
          _output.isSuccess = false;
          _output.message = "Menu creation failed";
        });
    } catch (error) {
      _output.data = error.message;
      _output.isSuccess = false;
      _output.message = "Menu creation failed";
    }
  } else {
    _output.data = lang.required_field;
    _output.isSuccess = false;
    _output.message = lang.content_create_fail;
  }
  res.send(_output);
};

exports.create = async function(req, res, next) {
  var _output = new output();
  const { main_menu, primary_menu, position, secondary_menu } = req.body;
  if (main_menu != "" && primary_menu != "") {
    var updateQuery =
      "UPDATE `menu` SET `position`='" +
      position +
      "' WHERE `id` = '" +
      main_menu +
      "'";
    var primaryMenuQuery =
      "INSERT INTO `menu`(`primary_menu`, `parent_id`, `position`) VALUES ('" +
      primary_menu +
      "','" +
      main_menu +
      "','" +
      position +
      "')";

    await db_library
      .execute(primaryMenuQuery)
      .then(async primaryVal => {
        if (secondary_menu[0].menu != "") {
          function insertValues(ob, childId) {
            return "('" + ob.menu + "','" + childId + "','" + position + "')";
          }

          var secondaryMenuQuery =
            "INSERT INTO `menu`(`secondary_menu`, `parent_id`, `position`) VALUES ";

          var valueStrs = [];
          for (var i = 0; i < secondary_menu.length; i++) {
            valueStrs.push(
              insertValues(secondary_menu[i], primaryVal.insertId)
            );
          }
          secondaryMenuQuery += valueStrs.join(",");

          await db_library
            .execute(secondaryMenuQuery)
            .then(async secondaryVal => {
              await db_library
                .execute(updateQuery)
                .then(async value => {
                  _output.data = secondaryVal;
                  _output.isSuccess = true;
                  _output.message = "Menu creation successfully";
                })
                .catch(err => {
                  _output.data = {};
                  _output.isSuccess = false;
                  _output.message = "Menu creation failed";
                });
            })
            .catch(err => {
              _output.data = err.message;
              _output.isSuccess = false;
              _output.message = "Menu creation failed";
            });
        } else {
          await db_library
            .execute(updateQuery)
            .then(async value => {
              _output.data = primaryVal;
              _output.isSuccess = true;
              _output.message = "Menu creation successfully";
            })
            .catch(err => {
              _output.data = {};
              _output.isSuccess = false;
              _output.message = "Menu creation failed";
            });
        }
      })
      .catch(err => {
        _output.data = err.message;
        _output.isSuccess = false;
        _output.message = "Menu creation failed";
      });
  } else {
    if (main_menu != "") {
      var updateQuery =
        "UPDATE `menu` SET `position`='" +
        position +
        "' WHERE `id` = '" +
        main_menu +
        "'";
      await db_library
        .execute(updateQuery)
        .then(async value => {
          _output.data = value;
          _output.isSuccess = true;
          _output.message = "Menu creation successfully";
        })
        .catch(err => {
          _output.data = {};
          _output.isSuccess = false;
          _output.message = "Menu creation failed";
        });
    }
  }
  res.send(_output);
};

exports.getAll = async function(req, res, next) {
  var _output = new output();
  const query = "SELECT `id`,`main_menu` FROM `menu` WHERE `parent_id`= '0'";

  await db_library
    .execute(query)
    .then(async value => {
      _output.data = value;
      _output.isSuccess = true;
      _output.message = "Get all menu data";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Get menu data failed ";
    });
  res.send(_output);
};

exports.view = async function(req, res, next) {
  var _output = new output();
  async function getPrimaryTreeMenu(id) {
    try {
      const primaryTreeQuery =
        "SELECT `id`,`primary_menu`, `path`,`is_delete` FROM `menu` WHERE `parent_id`= '" +
        id +
        "'";
      return await db_library.execute(primaryTreeQuery).then(async data => {
        return data;
      });
    } catch (error) {
      return error;
    }
  }

  async function getSecondaryTreeMenu(id) {
    try {
      const secondaryTreeQuery =
        "SELECT `id`,`secondary_menu`, `path`,`is_delete` FROM `menu` WHERE `parent_id`= '" +
        id +
        "'";
      return await db_library.execute(secondaryTreeQuery).then(async data => {
        return data;
      });
    } catch (error) {
      return error;
    }
  }

  const query =
    "SELECT distinct(`id`),`main_menu`, `path`,`is_delete` FROM `menu` WHERE `parent_id`= '0'";

  await db_library
    .execute(query)
    .then(async mainData => {
      const treeData = [];
      let primaryTree = [];
      for (let i = 0; i < mainData.length; i++) {
        const primaryData = await getPrimaryTreeMenu(mainData[i].id);
        if (primaryData.length > 0) {
          for (let j = 0; j < primaryData.length; j++) {
            const secondaryData = await getSecondaryTreeMenu(primaryData[j].id);
            primaryTree.push({
              id: primaryData[j].id,
              primary_menu: primaryData[j].primary_menu,
              path: primaryData[j].path,
              isDelete: primaryData[j].is_delete,
              children: secondaryData
            });
          }
        }

        treeData.push({
          id: mainData[i].id,
          main_name: mainData[i].main_menu,
          path: mainData[i].path,
          isDelete: mainData[i].is_delete,
          child: primaryTree
        });
        primaryTree = [];
      }
      _output.data = treeData;
      _output.isSuccess = true;
      _output.message = "Get all menu data";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Get menu data failed ";
    });
  res.send(_output);
};

exports.topTree = async function(req, res, next) {
  var _output = new output();
  async function getPrimaryTreeMenu(id) {
    try {
      const primaryTreeQuery =
        "SELECT `id`,`primary_menu`, `path` FROM `menu` WHERE `parent_id`= '" +
        id +
        "' AND `active` = '1' AND `position` = 'top'";
      return await db_library.execute(primaryTreeQuery).then(async data => {
        return data;
      });
    } catch (error) {
      return error;
    }
  }

  async function getSecondaryTreeMenu(id) {
    try {
      const secondaryTreeQuery =
        "SELECT `id`,`secondary_menu`, `path` FROM `menu` WHERE `parent_id`= '" +
        id +
        "' AND `active` = '1' AND `position` = 'top'";
      return await db_library.execute(secondaryTreeQuery).then(async data => {
        return data;
      });
    } catch (error) {
      return error;
    }
  }

  const query =
    "SELECT distinct(`id`),`main_menu`, `path` FROM `menu` WHERE `parent_id`= '0' AND `active` = '1' AND `position` = 'top'";

  await db_library
    .execute(query)
    .then(async mainData => {
      const treeData = [];
      let primaryTree = [];
      for (let i = 0; i < mainData.length; i++) {
        const primaryData = await getPrimaryTreeMenu(mainData[i].id);
        if (primaryData.length > 0) {
          for (let j = 0; j < primaryData.length; j++) {
            const secondaryData = await getSecondaryTreeMenu(primaryData[j].id);
            //console.log(secondaryData);
            primaryTree.push({
              id: primaryData[j].id,
              primary_menu: primaryData[j].primary_menu,
              path: primaryData[j].path,
              children: secondaryData
            });
          }
        }

        treeData.push({
          id: mainData[i].id,
          main_name: mainData[i].main_menu,
          path: mainData[i].path,
          child: primaryTree
        });
        primaryTree = [];
      }
      _output.data = treeData;
      _output.isSuccess = true;
      _output.message = "Get all menu data";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Get menu data failed ";
    });
  res.send(_output);
};

exports.bottomTree = async function(req, res, next) {
  var _output = new output();
  const query =
    "SELECT distinct(`id`),`main_menu`, `path` FROM `menu` WHERE `parent_id`= '0' AND `active` = '1' AND `is_delete` = '0' AND `position` = 'bottom'";

  await db_library
    .execute(query)
    .then(async mainData => {
      const bottomTreeData = [];
      for (let i = 0; i < mainData.length; i++) {
        bottomTreeData.push({
          id: mainData[i].id,
          main_name: mainData[i].main_menu,
          path: mainData[i].path
        });
      }
      _output.data = bottomTreeData;
      _output.isSuccess = true;
      _output.message = "Get all menu data";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Get menu data failed ";
    });
  res.send(_output);
};

exports.getname = async function(req, res, next) {
  var _output = new output();
  const { id } = req.body;
  const query = "SELECT * FROM `menu` WHERE `id`= '" + id + "'";

  await db_library
    .execute(query)
    .then(async value => {
      _output.data = value;
      _output.isSuccess = true;
      _output.message = "Get all menu data";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Get menu data failed ";
    });
  res.send(_output);
};

exports.list = async function(req, res, next) {
  var _output = new output();
  const query = "SELECT * FROM `menu`";
  let menuObj = {};
  let menuData = [];
  await db_library
    .execute(query)
    .then(async value => {
      for (let i = 0; i < value.length; i++) {
        if (value[i].parent_id == "0") {
          menuObj = {
            id: value[i].id,
            name: value[i].main_menu,
            position: value[i].position
          };
        } else {
          menuObj = {
            id: value[i].id,
            position: value[i].position,
            name:
              value[i].secondary_menu != null
                ? value[i].secondary_menu
                : value[i].primary_menu
          };
        }
        menuData.push(menuObj);
      }
      _output.data = menuData;
      _output.isSuccess = true;
      _output.message = "Get all menu data";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Get menu data failed ";
    });
  res.send(_output);
};

exports.editmenu = async function(req, res, next) {
  var _output = new output();
  async function getPrimaryTreeMenu(id) {
    try {
      const primaryTreeQuery =
        "SELECT `id`,`primary_menu`, `path`,`is_delete` FROM `menu` WHERE `parent_id`= '" +
        id +
        "'";
      return await db_library.execute(primaryTreeQuery).then(async data => {
        return data;
      });
    } catch (error) {
      return error;
    }
  }

  async function getSecondaryTreeMenu(id) {
    try {
      const secondaryTreeQuery =
        "SELECT `id`,`secondary_menu`, `path`,`is_delete` FROM `menu` WHERE `parent_id`= '" +
        id +
        "'";
      return await db_library.execute(secondaryTreeQuery).then(async data => {
        return data;
      });
    } catch (error) {
      return error;
    }
  }

  const query =
    "SELECT `id`,`main_menu`, `path`,`is_delete`, `position` FROM `menu` WHERE `id`= '" +
    req.params.id +
    "'";

  await db_library
    .execute(query)
    .then(async mainData => {
      const treeData = [];
      let primaryTree = [];
      for (let i = 0; i < mainData.length; i++) {
        const primaryData = await getPrimaryTreeMenu(mainData[i].id);
        if (primaryData.length > 0) {
          for (let j = 0; j < primaryData.length; j++) {
            const secondaryData = await getSecondaryTreeMenu(primaryData[j].id);
            primaryTree.push({
              id: primaryData[j].id,
              primary_menu: primaryData[j].primary_menu,
              path: primaryData[j].path,
              isDelete: primaryData[j].is_delete,
              children: secondaryData
            });
          }
        }

        treeData.push({
          id: mainData[i].id,
          main_name: mainData[i].main_menu,
          path: mainData[i].path,
          position: mainData[i].position,
          isDelete: mainData[i].is_delete,
          child: primaryTree
        });
        primaryTree = [];
      }
      _output.data = treeData;
      _output.isSuccess = true;
      _output.message = "Get all menu data";
    })
    .catch(err => {
      _output.data = {};
      _output.isSuccess = false;
      _output.message = "Get menu data failed ";
    });
  res.send(_output);
};

exports.createprimarymenu = async function(req, res, next) {
  var _output = new output();
  const { mainid, mainname, primarymenu } = req.body;
  if (mainid != "" && primarymenu[0].primarymenu != "") {
    const query = "SELECT `position` FROM `menu` WHERE `id`= '" + mainid + "'";

    await db_library
      .execute(query)
      .then(async position => {
        //console.log(position.position);
        if (primarymenu[0].primarymenu != "" && position.position != "") {
          function insertValues(ob, childId, position) {
            return (
              "('" + ob.primarymenu + "','" + childId + "','" + position + "')"
            );
          }

          var primaryMenuQuery =
            "INSERT INTO `menu`(`primary_menu`, `parent_id`, `position`) VALUES ";

          var valueStrs = [];
          for (var i = 0; i < primarymenu.length; i++) {
            valueStrs.push(
              insertValues(primarymenu[i], mainid, position.position)
            );
          }
          primaryMenuQuery += valueStrs.join(",");

          await db_library
            .execute(primaryMenuQuery)
            .then(async primaryVal => {
              _output.data = primaryVal;
              _output.isSuccess = true;
              _output.message = "Menu creation successfully";
            })
            .catch(err => {
              _output.data = err.message;
              _output.isSuccess = false;
              _output.message = "Menu creation failed";
            });
        }
      })
      .catch(err => {
        _output.data = err.message;
        _output.isSuccess = false;
        _output.message = "Menu creation failed";
      });
  } else {
    _output.data = err.message;
    _output.isSuccess = false;
    _output.message = "Menu creation failed";
  }
  res.send(_output);
};

exports.getprimarymenu = async function(req, res, next) {
  var _output = new output();
  const id = req.params.id;
  if (id != "") {
    const query =
      "SELECT `id`, `primary_menu` FROM `menu` WHERE `parent_id`= '" + id + "'";
    await db_library
      .execute(query)
      .then(value => {
        if (value.length > 0) {
          var result = value;
          var obj = {
            menu_list: result
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

exports.createsecondarymenu = async function(req, res, next) {
  var _output = new output();
  const { mainid, mainname, primarymenu, secondarymenu } = req.body;
  if (primarymenu != "" && secondarymenu[0].secondarymenu != "") {
    const query =
      "SELECT `position` FROM `menu` WHERE `id`= '" + primarymenu + "'";

    await db_library
      .execute(query)
      .then(async position => {
        //console.log(position.position);
        if (secondarymenu[0].secondarymenu != "" && position.position != "") {
          function insertValues(ob, childId, position) {
            return (
              "('" +
              ob.secondarymenu +
              "','" +
              childId +
              "','" +
              position +
              "')"
            );
          }

          var secondaryMenuQuery =
            "INSERT INTO `menu`(`secondary_menu`, `parent_id`, `position`) VALUES ";

          var valueStrs = [];
          for (var i = 0; i < secondarymenu.length; i++) {
            valueStrs.push(
              insertValues(secondarymenu[i], primarymenu, position.position)
            );
          }
          secondaryMenuQuery += valueStrs.join(",");

          await db_library
            .execute(secondaryMenuQuery)
            .then(async secondaryVal => {
              _output.data = secondaryVal;
              _output.isSuccess = true;
              _output.message = "Menu creation successfully";
            })
            .catch(err => {
              _output.data = err.message;
              _output.isSuccess = false;
              _output.message = "Menu creation failed";
            });
        }
      })
      .catch(err => {
        _output.data = err.message;
        _output.isSuccess = false;
        _output.message = "Menu creation failed";
      });
  } else {
    _output.data = err.message;
    _output.isSuccess = false;
    _output.message = "Menu creation failed";
  }
  res.send(_output);
};

exports.menuDelete = async function(req, res, next) {
  var _output = new output();

  async function deleteChilOrChildren(id) {
    try {
      var queryDelete = "DELETE FROM `menu` WHERE `parent_id` = " + id;
      return await db_library.execute(queryDelete).then(async data => {
        return data;
      });
    } catch (error) {
      return error;
    }
  }

  const menuID = req.body.menuid;
  const identity = req.body.identity;
  let query;
  if (identity) {
    query = "SELECT `id` FROM `menu` WHERE `parent_id`= '" + menuID + "'";
  }
  //console.log(menuID);
  var queryDelete = "DELETE FROM `menu` WHERE `id` = " + menuID;
  await db_library
    .execute(query)
    .then(async getData => {
      if (getData.length > 0) {
        await deleteChilOrChildren(getData[0].id);

        await db_library
          .execute(queryDelete)
          .then(async data => {
            //console.log(data.affectedRows);
            if (data.affectedRows > 0) {
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
      } else {
        await db_library
          .execute(queryDelete)
          .then(async data => {
            //console.log(data.affectedRows);
            if (data.affectedRows > 0) {
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
      }
    })
    .catch(err => {
      _output.data = err.message;
      _output.isSuccess = false;
      _output.message = "Menu delete failed";
    });
  res.send(_output);
};
