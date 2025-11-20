module main
go 1.19

replace common/threetools => ../../../common/gosrc/threetools
replace common/jsbindings => ../../../common/gosrc/jsbindings

require (
	common/jsbindings v0.0.0-00010101000000-000000000000
	common/threetools v0.0.0-00010101000000-000000000000
)
