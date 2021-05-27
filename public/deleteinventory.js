function deleteInventory(hid, sid){
	$.ajax({
		url: "/inventory/" + hid + "/supply/" + sid,
		type: "DELETE",
		success: function(result){
			window.location.reload(true);
		}
	})
};