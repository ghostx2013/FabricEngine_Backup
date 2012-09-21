# /* **************************************************************************
#  *                                                                          *
#  *     (C) Copyright Paul Mensonides 2002.
#  *     Distributed under the Boost Software License, Version 1.0. (See
#  *     accompanying file LICENSE_1_0.txt or copy at
#  *     http://www.boost.org/LICENSE_1_0.txt)
#  *                                                                          *
#  ************************************************************************** */
#
# /* See http://www.boost.org for most recent version. */
#
# ifndef BOOST_PREPROCESSOR_DETAIL_AUTO_REC_HPP
# define BOOST_PREPROCESSOR_DETAIL_AUTO_REC_HPP
#
# include <boost/preprocessor/control/iif.hpp>
#
# /* BOOST_PP_AUTO_REC */
#
# define BOOST_PP_AUTO_REC(pred, n) BOOST_PP_NODE_ENTRY_ ## n(pred)
#
# define BOOST_PP_NODE_ENTRY_256(p) BOOST_PP_NODE_128(p)(p)(p)(p)(p)(p)(p)(p)
# define BOOST_PP_NODE_ENTRY_128(p) BOOST_PP_NODE_64(p)(p)(p)(p)(p)(p)(p)
# define BOOST_PP_NODE_ENTRY_64(p) BOOST_PP_NODE_32(p)(p)(p)(p)(p)(p)
# define BOOST_PP_NODE_ENTRY_32(p) BOOST_PP_NODE_16(p)(p)(p)(p)(p)
# define BOOST_PP_NODE_ENTRY_16(p) BOOST_PP_NODE_8(p)(p)(p)(p)
# define BOOST_PP_NODE_ENTRY_8(p) BOOST_PP_NODE_4(p)(p)(p)
# define BOOST_PP_NODE_ENTRY_4(p) BOOST_PP_NODE_2(p)(p)
# define BOOST_PP_NODE_ENTRY_2(p) BOOST_PP_NODE_1(p)
#
# define BOOST_PP_NODE_128(p) BOOST_PP_IIF(p##(128), BOOST_PP_NODE_64, BOOST_PP_NODE_192)
#    define BOOST_PP_NODE_64(p) BOOST_PP_IIF(p##(64), BOOST_PP_NODE_32, BOOST_PP_NODE_96)
#        define BOOST_PP_NODE_32(p) BOOST_PP_IIF(p##(32), BOOST_PP_NODE_16, BOOST_PP_NODE_48)
#            define BOOST_PP_NODE_16(p) BOOST_PP_IIF(p##(16), BOOST_PP_NODE_8, BOOST_PP_NODE_24)
#                define BOOST_PP_NODE_8(p) BOOST_PP_IIF(p##(8), BOOST_PP_NODE_4, BOOST_PP_NODE_12)
#                    define BOOST_PP_NODE_4(p) BOOST_PP_IIF(p##(4), BOOST_PP_NODE_2, BOOST_PP_NODE_6)
#                        define BOOST_PP_NODE_2(p) BOOST_PP_IIF(p##(2), BOOST_PP_NODE_1, BOOST_PP_NODE_3)
#                            define BOOST_PP_NODE_1(p) BOOST_PP_IIF(p##(1), 1, 2)
#                            define BOOST_PP_NODE_3(p) BOOST_PP_IIF(p##(3), 3, 4)
#                        define BOOST_PP_NODE_6(p) BOOST_PP_IIF(p##(6), BOOST_PP_NODE_5, BOOST_PP_NODE_7)
#                            define BOOST_PP_NODE_5(p) BOOST_PP_IIF(p##(5), 5, 6)
#                            define BOOST_PP_NODE_7(p) BOOST_PP_IIF(p##(7), 7, 8)
#                    define BOOST_PP_NODE_12(p) BOOST_PP_IIF(p##(12), BOOST_PP_NODE_10, BOOST_PP_NODE_14)
#                        define BOOST_PP_NODE_10(p) BOOST_PP_IIF(p##(10), BOOST_PP_NODE_9, BOOST_PP_NODE_11)
#                            define BOOST_PP_NODE_9(p) BOOST_PP_IIF(p##(9), 9, 10)
#                            define BOOST_PP_NODE_11(p) BOOST_PP_IIF(p##(11), 11, 12)
#                        define BOOST_PP_NODE_14(p) BOOST_PP_IIF(p##(14), BOOST_PP_NODE_13, BOOST_PP_NODE_15)
#                            define BOOST_PP_NODE_13(p) BOOST_PP_IIF(p##(13), 13, 14)
#                            define BOOST_PP_NODE_15(p) BOOST_PP_IIF(p##(15), 15, 16)
#                define BOOST_PP_NODE_24(p) BOOST_PP_IIF(p##(24), BOOST_PP_NODE_20, BOOST_PP_NODE_28)
#                    define BOOST_PP_NODE_20(p) BOOST_PP_IIF(p##(20), BOOST_PP_NODE_18, BOOST_PP_NODE_22)
#                        define BOOST_PP_NODE_18(p) BOOST_PP_IIF(p##(18), BOOST_PP_NODE_17, BOOST_PP_NODE_19)
#                            define BOOST_PP_NODE_17(p) BOOST_PP_IIF(p##(17), 17, 18)
#                            define BOOST_PP_NODE_19(p) BOOST_PP_IIF(p##(19), 19, 20)
#                        define BOOST_PP_NODE_22(p) BOOST_PP_IIF(p##(22), BOOST_PP_NODE_21, BOOST_PP_NODE_23)
#                            define BOOST_PP_NODE_21(p) BOOST_PP_IIF(p##(21), 21, 22)
#                            define BOOST_PP_NODE_23(p) BOOST_PP_IIF(p##(23), 23, 24)
#                    define BOOST_PP_NODE_28(p) BOOST_PP_IIF(p##(28), BOOST_PP_NODE_26, BOOST_PP_NODE_30)
#                        define BOOST_PP_NODE_26(p) BOOST_PP_IIF(p##(26), BOOST_PP_NODE_25, BOOST_PP_NODE_27)
#                            define BOOST_PP_NODE_25(p) BOOST_PP_IIF(p##(25), 25, 26)
#                            define BOOST_PP_NODE_27(p) BOOST_PP_IIF(p##(27), 27, 28)
#                        define BOOST_PP_NODE_30(p) BOOST_PP_IIF(p##(30), BOOST_PP_NODE_29, BOOST_PP_NODE_31)
#                            define BOOST_PP_NODE_29(p) BOOST_PP_IIF(p##(29), 29, 30)
#                            define BOOST_PP_NODE_31(p) BOOST_PP_IIF(p##(31), 31, 32)
#            define BOOST_PP_NODE_48(p) BOOST_PP_IIF(p##(48), BOOST_PP_NODE_40, BOOST_PP_NODE_56)
#                define BOOST_PP_NODE_40(p) BOOST_PP_IIF(p##(40), BOOST_PP_NODE_36, BOOST_PP_NODE_44)
#                    define BOOST_PP_NODE_36(p) BOOST_PP_IIF(p##(36), BOOST_PP_NODE_34, BOOST_PP_NODE_38)
#                        define BOOST_PP_NODE_34(p) BOOST_PP_IIF(p##(34), BOOST_PP_NODE_33, BOOST_PP_NODE_35)
#                            define BOOST_PP_NODE_33(p) BOOST_PP_IIF(p##(33), 33, 34)
#                            define BOOST_PP_NODE_35(p) BOOST_PP_IIF(p##(35), 35, 36)
#                        define BOOST_PP_NODE_38(p) BOOST_PP_IIF(p##(38), BOOST_PP_NODE_37, BOOST_PP_NODE_39)
#                            define BOOST_PP_NODE_37(p) BOOST_PP_IIF(p##(37), 37, 38)
#                            define BOOST_PP_NODE_39(p) BOOST_PP_IIF(p##(39), 39, 40)
#                    define BOOST_PP_NODE_44(p) BOOST_PP_IIF(p##(44), BOOST_PP_NODE_42, BOOST_PP_NODE_46)
#                        define BOOST_PP_NODE_42(p) BOOST_PP_IIF(p##(42), BOOST_PP_NODE_41, BOOST_PP_NODE_43)
#                            define BOOST_PP_NODE_41(p) BOOST_PP_IIF(p##(41), 41, 42)
#                            define BOOST_PP_NODE_43(p) BOOST_PP_IIF(p##(43), 43, 44)
#                        define BOOST_PP_NODE_46(p) BOOST_PP_IIF(p##(46), BOOST_PP_NODE_45, BOOST_PP_NODE_47)
#                            define BOOST_PP_NODE_45(p) BOOST_PP_IIF(p##(45), 45, 46)
#                            define BOOST_PP_NODE_47(p) BOOST_PP_IIF(p##(47), 47, 48)
#                define BOOST_PP_NODE_56(p) BOOST_PP_IIF(p##(56), BOOST_PP_NODE_52, BOOST_PP_NODE_60)
#                    define BOOST_PP_NODE_52(p) BOOST_PP_IIF(p##(52), BOOST_PP_NODE_50, BOOST_PP_NODE_54)
#                        define BOOST_PP_NODE_50(p) BOOST_PP_IIF(p##(50), BOOST_PP_NODE_49, BOOST_PP_NODE_51)
#                            define BOOST_PP_NODE_49(p) BOOST_PP_IIF(p##(49), 49, 50)
#                            define BOOST_PP_NODE_51(p) BOOST_PP_IIF(p##(51), 51, 52)
#                        define BOOST_PP_NODE_54(p) BOOST_PP_IIF(p##(54), BOOST_PP_NODE_53, BOOST_PP_NODE_55)
#                            define BOOST_PP_NODE_53(p) BOOST_PP_IIF(p##(53), 53, 54)
#                            define BOOST_PP_NODE_55(p) BOOST_PP_IIF(p##(55), 55, 56)
#                    define BOOST_PP_NODE_60(p) BOOST_PP_IIF(p##(60), BOOST_PP_NODE_58, BOOST_PP_NODE_62)
#                        define BOOST_PP_NODE_58(p) BOOST_PP_IIF(p##(58), BOOST_PP_NODE_57, BOOST_PP_NODE_59)
#                            define BOOST_PP_NODE_57(p) BOOST_PP_IIF(p##(57), 57, 58)
#                            define BOOST_PP_NODE_59(p) BOOST_PP_IIF(p##(59), 59, 60)
#                        define BOOST_PP_NODE_62(p) BOOST_PP_IIF(p##(62), BOOST_PP_NODE_61, BOOST_PP_NODE_63)
#                            define BOOST_PP_NODE_61(p) BOOST_PP_IIF(p##(61), 61, 62)
#                            define BOOST_PP_NODE_63(p) BOOST_PP_IIF(p##(63), 63, 64)
#        define BOOST_PP_NODE_96(p) BOOST_PP_IIF(p##(96), BOOST_PP_NODE_80, BOOST_PP_NODE_112)
#            d